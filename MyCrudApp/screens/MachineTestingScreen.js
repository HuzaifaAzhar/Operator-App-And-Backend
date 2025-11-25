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
    const [mobileValue, setMobileValue] = useState(null);
    useEffect(() => {
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (selectedVending) {
            fetchOPSValue();
            fetchMobileValue();
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
    //fetch current mobile value
      const fetchMobileValue = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/fetch-mobile-value?tableNumber=${selectedVending}`);
            if(response.data[0]?.TypeValue == 1){
                setMobileValue("Moving Cake to W");
            } else if(response.data[0]?.TypeValue == 2){
                setMobileValue("Initializing Customer Doors");
            } else if(response.data[0]?.TypeValue == 3){
                setMobileValue("Initializing Cabinet Doors");
            } else{
                setMobileValue("No Test Running");
            }
            //console.log("Mobile Value Fetched:", response.data[0]?.TypeValue);
        } catch (error) {
            console.error("Error fetching Machine Operation Value:", error);
            Alert.alert("Error", "Failed to fetch Machine Operation value.");
        } finally {
            setLoading(false);
        }
    };

    // Reset Operation value to 1 with confirmation
    const handleMovingCake = async () => {
        Alert.alert(
            "Confirm Move Cake to W",
            "Are you sure you want to move cake from X to W?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => handleUpdateMobile(1) }
            ]
        );
    };

        const handleCustomerDoors = async () => {
        Alert.alert(
            "Confirm Initialize Customer Door",
            "Are you sure you want to Initilize Customer Doors?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => handleUpdateMobile(2) }
            ]
        );
    };

        const handleCabinetDoors = async () => {
        Alert.alert(
            "Confirm Initialize Cabinet Doors",
            "Are you sure you want to initialize Cabinet Doors?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => handleUpdateMobile(3) }
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

        // Reset OPS value to zero with confirmation
    const handleResetTest = async () => {
        Alert.alert(
            "Confirm Reset",
            "Are you sure you want to reset testing?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => resetTest() }
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

        const resetTest = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_BASE_URL}/reset-mobile-value?tableNumber=${selectedVending}`);
            fetchOPSValue(); // Refresh after reset
        } catch (error) {
            console.error("Error resetting:", error);
            Alert.alert("Error", "Failed to reset.");
        } finally {
            setLoading(false);
            fetchMobileValue(); // Refresh after update
        }
    };

    // Update OPS value manually (User Input)
    const handleUpdateMobile = async (value) => {
    //console.log("Operation Value to be set:", value);
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
        Alert.alert("Invalid Input", "Please enter a valid number.");
        return;
    }

    try {
        setLoading(true);
        await axios.post(`${API_BASE_URL}/update-mobile-value?tableNumber=${selectedVending}`, { value: parsedValue });
    } catch (error) {
        console.error("Error performing operation:", error);
        Alert.alert("Error", "Failed to perform operation.");
    } finally {
        setLoading(false);
        fetchMobileValue(); // Refresh after update
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
            <Text style={styles.valueText}>Test Operation Status: <Text style={styles.boldText}>{mobileValue}</Text></Text>
            {/* Update OPS Section */}
            {/* <View style={styles.inputContainer}>
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
            </View> */}

            {/* Buttons Section */}
            <TouchableOpacity style={styles.button} onPress={handleResetToZero}>
                <Text style={styles.buttonText}>Clear OPS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleResetTest}>
                <Text style={styles.buttonText}>Reset Test Operation</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.buttonSecondary} onPress={handleMovingCake}>
                <Text style={styles.buttonText}>Move Cake to W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleCustomerDoors}>
                <Text style={styles.buttonText}>Initialize Customer Door</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.buttonSecondary} onPress={handleCabinetDoors}>
                <Text style={styles.buttonText}>Initialize Cabinet Doors</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset Operation to 1 & Clear OPS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => Alert.alert("Moving Bowl")}>
                <Text style={styles.buttonText}>Move Bowl to Empty</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => Alert.alert("Testing Machine")}>
                <Text style={styles.buttonText}>Test Machine</Text>
            </TouchableOpacity> */}
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