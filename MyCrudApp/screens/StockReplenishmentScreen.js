import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const API_BASE_URL = 'http://8.219.64.146:3001';

const StockReplenishmentScreen = () => {
    const [tableNames, setTableNames] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [selectedVending, setSelectedVending] = useState(null);
    const [stockData, setStockData] = useState([]);
    const [expiryData, setExpiryData] = useState([]);
    const [nextStock, setNextStock] = useState([]);
    const [loading, setLoading] = useState(true);

    const [quantities, setQuantities] = useState(["", "", "", ""]);
    const [expiries, setExpiries] = useState(["", "", "", ""]);

    useEffect(() => {
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (selectedVending) {
            fetchAllData();
        }
    }, [selectedVending]);

    const fetchTableNames = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/gettables`);
            const tables = response.data;
            setTableNames(tables);
            const items = tables.map((table) => ({
                label: table.replace(/_/g, ' '),
                value: table.split('_').pop(),
            }));
            setDropdownItems(items);
            if (items.length > 0) {
                setSelectedVending(items[0].value);
            }
        } catch (error) {
            console.error('Error fetching table names:', error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const stockResponse = await axios.get(`${API_BASE_URL}/fetch-stock?tableNumber=${selectedVending}`);
            const expiryResponse = await axios.get(`${API_BASE_URL}/fetch-expiry-dates?tableNumber=${selectedVending}`);
            const nextStockResponse = await axios.get(`${API_BASE_URL}/fetch-next-stock?tableNumber=${selectedVending}`);

            setStockData(stockResponse.data);
            setExpiryData(expiryResponse.data);
            setNextStock(nextStockResponse.data);

            setQuantities(stockResponse.data.map(item => item.TypeValue));
            setExpiries(expiryResponse.data.map(item => item.TypeValue)); // default to 1 for simplicity
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const submitUpdate = async () => {
        try {
            await axios.post(`${API_BASE_URL}/update-all-product-details?tableNumber=${selectedVending}`, {
                quantities,
                expiries
            });
            Alert.alert('Success', 'Product details updated.');
            fetchAllData(); // Refresh data
        } catch (error) {
            console.error("Update failed:", error);
            Alert.alert('Error', 'Failed to update product details.');
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" style={styles.loading} />;

    return (
        <View style={styles.container}>
            <DropDownPicker
                open={dropdownOpen}
                value={selectedVending}
                items={dropdownItems}
                setOpen={setDropdownOpen}
                setValue={setSelectedVending}
                setItems={setDropdownItems}
                placeholder="Select Vending Machine"
                style={styles.dropdown}
                containerStyle={{ marginBottom: 20 }}
            />

            <Text style={styles.title}>Stock Replenishment</Text>
            <Button title="Refresh" onPress={fetchAllData} color="blue" />

            <View style={styles.headerRow}>
                <Text style={styles.header}>P#</Text>
                <Text style={styles.header}>Stock</Text>
                <Text style={styles.header}>Next</Text>
                <Text style={styles.header}>Expiry</Text>
            </View>

            <FlatList
                data={stockData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const expiryItem = expiryData[index] || {};
                    const nextItem = nextStock[index] || {};

                    return (
                        <View style={styles.row}>
                            <Text style={styles.cell}>P{index + 1}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={quantities[index]}
                                onChangeText={text => {
                                    const newQty = [...quantities];
                                    newQty[index] = text;
                                    setQuantities(newQty);
                                }}
                            />
                            <Text style={styles.cell}>{nextItem.TypeValue || 'N/A'}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={expiries[index]}
                                onChangeText={text => {
                                    const newExp = [...expiries];
                                    newExp[index] = text;
                                    setExpiries(newExp);
                                }}
                            />
                        </View>
                    );
                }}
            />

            <Button title="Submit Update" onPress={submitUpdate} color="green" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    dropdown: {
        borderColor: '#ccc',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingBottom: 5,
        marginBottom: 5,
    },
    header: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        textAlign: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StockReplenishmentScreen;
