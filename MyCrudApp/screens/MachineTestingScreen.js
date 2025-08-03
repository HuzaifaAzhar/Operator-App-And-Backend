import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, ActivityIndicator, 
    StyleSheet, Alert, TouchableOpacity 
} from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const API_BASE_URL = 'http://8.219.64.146:3001';

const MachineTestingScreen = () => {
    const [opsValue, setOpsValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newOpsValue, setNewOpsValue] = useState(''); // User input for updating OPS
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [selectedVending, setSelectedVending] = useState(null);

    useEffect(() => {
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (selectedVending) {
            fetchOPSValue();
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
            Alert.alert("Error", "Failed to fetch vending machines.");
        }
    };

    // Fetch current OPS value
    const fetchOPSValue = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/fetch-ops-value?tableNumber=${selectedVending}`);
            setOpsValue(response.data[0]?.TypeValue || 0);
        } catch (error) {
            console.error("Error fetching OPS Value:", error);
            Alert.alert("Error", "Failed to fetch OPS value.");
        } finally {
            setLoading(false);
        }
    };

    // Reset Operation value to 1 with confirmation
    const handleOperationResetToZero = async () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure you want to reset Operation value to 1?",
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

    // Handle both reset operations & reset OPS value
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

    // Actual API call for resetting Operation value
    const resetOperation = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_BASE_URL}/reset-test-value?tableNumber=${selectedVending}`);
            // fetchOPSValue(); // No need to refresh here as it affects ID 85, not ID 73
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
            await axios.post(`${API_BASE_URL}/reset-ops-value?tableNumber=${selectedVending}`);
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
            await axios.post(`${API_BASE_URL}/update-ops-value?tableNumber=${selectedVending}`, { value });
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
        backgroundColor: '#f4f4f4',
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
        width: '100%',
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
        width: '100%',
        alignItems: 'center',
    },
    buttonSecondary: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MachineTestingScreen;