import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const StockReplenishmentScreen = () => {
    const [stockData, setStockData] = useState([]);
    const [expiryData, setExpiryData] = useState([]);
    const [nextStock, setNextStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const stockResponse = await axios.get('http://192.168.0.105:3000/fetch-stock');
            const expiryResponse = await axios.get('http://192.168.0.105:3000/fetch-expiry-dates');
            const nextStockResponse = await axios.get('http://192.168.0.105:3000/fetch-next-stock');

            setStockData(stockResponse.data);
            setExpiryData(expiryResponse.data);
            setNextStock(nextStockResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stock Replenishment</Text>

            <View style={styles.headerRow}>
                <Text style={styles.header}>P#</Text>
                <Text style={styles.header}>Stock</Text>
                <Text style={styles.header}>Next</Text>
                <Text style={styles.header}>Expiry Date</Text>
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
                            <Text style={styles.cell}>{item.TypeValue} cakes</Text>
                            <Text style={styles.cell}>{nextItem.TypeValue || 'N/A'}</Text>
                            <Text style={styles.cell}>{expiryItem.TypeValue || 'N/A'}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    headerRow: { flexDirection: 'row', borderBottomWidth: 2, paddingBottom: 5, marginBottom: 5 },
    header: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
    row: { flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8 },
    cell: { flex: 1, textAlign: 'center' },
});

export default StockReplenishmentScreen;
