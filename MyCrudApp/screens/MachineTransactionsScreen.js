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
      const response = await axios.get('http://8.219.64.146:3001/fetch-transactions');
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
        keyExtractor={(item) => item.PaymentId.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Machine No: {item.MachineNumber}</Text>
            <Text>Amount: SGD {item.Amount}</Text>
            <Text>Date: {new Date(item.PaymentDate).toLocaleString()}</Text>
            <Text>Message: {item.PaymentMessage}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default MachineTransactionsScreen;
