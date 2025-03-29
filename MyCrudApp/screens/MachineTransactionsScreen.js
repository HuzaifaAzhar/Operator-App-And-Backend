import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const MachineTransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fetch-transactions');
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Machine Transactions</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>Machine No: {item.MachineNos}</Text>
                        <Text>RRN: {item.RRN}</Text>
                        <Text>Date: {item.Date}</Text>
                        <Text>Amount: {item.Amount}</Text>
                        <Text>Received From: {item.ReceivedFrom}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    item: { padding: 10, borderBottomWidth: 1 },
});

export default MachineTransactionsScreen;
