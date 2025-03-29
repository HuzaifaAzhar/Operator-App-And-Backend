import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const MachineOperationScreen = () => {
    const [operationValue, setOperationValue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOperationVariable();
    }, []);

    const fetchOperationVariable = async () => {
        try {
            const response = await axios.get('http://192.168.0.105:3000/fetch-operation-variable');
            setOperationValue(response.data[0]?.TypeValue);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Machine Operation</Text>
            <Text>Operation Value: {operationValue}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
});

export default MachineOperationScreen;
