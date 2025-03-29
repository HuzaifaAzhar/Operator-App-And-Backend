import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, Button, ActivityIndicator, 
    StyleSheet, Alert, TouchableOpacity 
} from 'react-native';
import axios from 'axios';

const MachineTestingScreen = () => {
    const [opsValue, setOpsValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newOpsValue, setNewOpsValue] = useState(''); // User input for updating OPS

    useEffect(() => {
        fetchOPSValue();
    }, []);

    // Fetch current OPS value
    const fetchOPSValue = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://192.168.0.105:3000/fetch-ops-value');
            setOpsValue(response.data[0]?.TypeValue || 0);
        } catch (error) {
            console.error("Error fetching OPS Value:", error);
            Alert.alert("Error", "Failed to fetch OPS value.");
        } finally {
            setLoading(false);
        }
    };

    // Reset Operation value to zero with confirmation
    const handleOperationResetToZero = async () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure you want to reset Operation value to zero?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => resetOperation() }
            ]
        );
    };
    // Reset OPS value to zero with confirmation
    const handleResetToZero = async () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure you want to reset OPS value to zero?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => resetOPS() }
            ]
        );
    };
    //to handle both reset operations & reset ops value
    const handleReset = async () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "OK", 
                    onPress: async () => {
                        await resetOPS();
                        await resetOperation();
                    }
                }
            ]
        );
    };    

        // Actual API call for resetting OPS value
        const resetOperation = async () => {
            try {
                setLoading(true);
                await axios.post('http://192.168.0.105:3000/reset-test-value');
                // fetchOPSValue(); // Refresh after reset
            } catch (error) {
                console.error("Error resetting Operation:", error);
                Alert.alert("Error", "Failed to reset Operation.");
            } finally {
                setLoading(false);
            }
        };
    // Actual API call for resetting OPS value
    const resetOPS = async () => {
        try {
            setLoading(true);
            await axios.post('http://192.168.0.105:3000/reset-ops-value');
            fetchOPSValue(); // Refresh after reset
        } catch (error) {
            console.error("Error resetting OPS:", error);
            Alert.alert("Error", "Failed to reset OPS.");
        } finally {
            setLoading(false);
        }
    };

    // Update OPS value manually (User Input)
    const handleUpdateOPS = async () => {
        const value = parseInt(newOpsValue);
        if (isNaN(value)) {
            Alert.alert("Invalid Input", "Please enter a valid number.");
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://192.168.0.105:3000/update-ops-value', { value });
            setNewOpsValue(''); // Clear input after update
            fetchOPSValue(); // Refresh after update
        } catch (error) {
            console.error("Error updating OPS:", error);
            Alert.alert("Error", "Failed to update OPS.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" style={styles.loading} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Machine Testing</Text>
            <Text style={styles.valueText}>OPS Value: <Text style={styles.boldText}>{opsValue}</Text></Text>

            {/* Update OPS Section */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OPS Value"
                    keyboardType="numeric"
                    value={newOpsValue}
                    onChangeText={setNewOpsValue}
                />
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateOPS}>
                    <Text style={styles.buttonText}>Update OPS</Text>
                </TouchableOpacity>
            </View>

            {/* Buttons Section */}
            <TouchableOpacity style={styles.button} onPress={handleResetToZero}>
                <Text style={styles.buttonText}>Clear OPS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleOperationResetToZero}>
                <Text style={styles.buttonText}>Reset Operation to 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset Operation to 1 & Clear OPS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => Alert.alert("Moving Bowl")}>
                <Text style={styles.buttonText}>Move Bowl to Empty</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => Alert.alert("Testing Machine")}>
                <Text style={styles.buttonText}>Test Machine</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    valueText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#222',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    updateButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonSecondary: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loading: {
        marginTop: 20,
    },
});

export default MachineTestingScreen;
