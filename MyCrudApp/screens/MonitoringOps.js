import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const MonitoringOps = ({ navigation }) => {
  const [selectedVending, setSelectedVending] = useState('vending_02'); // Default to vending_02
  const [opsValue, setOpsValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOpsValue();
  }, [selectedVending]); // Fetch data whenever selectedVending changes

  const fetchOpsValue = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://192.168.0.102:3000/fetch-ops-value?vending=${selectedVending}`);
      const opsValue = response.data[0].TypeValue.toString();
      setOpsValue(opsValue);
      determineDisplayText(opsValue);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineDisplayText = (opsValue) => {
    let text = '';
    switch (opsValue) {
      case '10':
        text = "Taking Bowl";
        // Add PaymentSuccess() function call if necessary
        break;
      case '20':
        text = "Add material";
        break;
      case '30':
        text = "Add water";
        break;
      case '40':
        text = "Heating";
        break;
      case '50':
        text = "Door Open";
        // Add CookingPage() function call if necessary
        break;
      case '60':
        text = "Wait to take away";
        // Add ReadyPage() function call if necessary
        break;
      case '70':
        text = "Taken away door close";
        // Add HomePage() function call if necessary
        break;
      case '100':
        text = "Operation error";
        break;
      case '110':
        text = "Didn't take away";
        break;
      case '120':
        text = "Miss taking Bowl";
        break;
      default:
        text = "Unknown Operation";
    }
    setDisplayText(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Picker
        selectedValue={selectedVending}
        onValueChange={(itemValue) => setSelectedVending(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Vending 01" value="vending_01" />
        <Picker.Item label="Vending 02" value="vending_02" />
      </Picker>
      <Button title="Fetch Data" onPress={fetchOpsValue} disabled={isLoading} />
      {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Operation Variable</Text>
          <Text style={styles.tableCell}>{opsValue}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Display Text</Text>
          <Text style={styles.tableCell}>{displayText}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  picker: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default MonitoringOps;
