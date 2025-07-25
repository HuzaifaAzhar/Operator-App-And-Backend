import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const API_BASE_URL = 'http://192.168.1.15:3000';

const MachineOperationScreen = () => {
    const [operationValue, setOperationValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [selectedVending, setSelectedVending] = useState(null);

    useEffect(() => {
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (selectedVending) {
            fetchOperationVariable();
        }
    }, [selectedVending]);

    // Fetch table names for dropdown
    const fetchTableNames = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/gettables`);
            const tables = response.data;
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
            setLoading(false);
        }
    };

    // Fetch operation value
    const fetchOperationVariable = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/fetch-test-value?tableNumber=${selectedVending}`);
            setOperationValue(response.data[0]?.TypeValue);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />;

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
                dropDownContainerStyle={styles.dropDownContainer}
            />
            <Text style={styles.title}>Machine Operation</Text>
            <Text style={styles.valueText}>Operation Value: {operationValue}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
    },
    dropdown: {
        borderColor: '#ccc',
        width: '100%',
    },
    dropDownContainer: {
        borderColor: '#ccc',
        maxHeight: 150, // Limit dropdown height to prevent overflow
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    valueText: {
        fontSize: 18,
        textAlign: 'center',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MachineOperationScreen;