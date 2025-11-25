import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const MonitoringOps = ({ navigation }) => {
  const [selectedVending, setSelectedVending] = useState('01'); // Default to 01
  const [opsValue, setOpsValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOpsValue();
  }, [selectedVending]); // Fetch data whenever selectedVending changes

  const fetchOpsValue = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://8.219.64.146:3001/fetch-ops-value?tableNumber=${selectedVending}`);
      const opsValue = response.data[0].TypeValue.toString();
      setOpsValue(opsValue);
      determineDisplayText(opsValue);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch operation value. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const determineDisplayText = (opsValue) => {
    let text = '';
    switch (opsValue) {
      case '10':
        text = 'Taking Bowl';
        break;
      case '20':
        text = 'Add material';
        break;
      case '30':
        text = 'Add water';
        break;
      case '40':
        text = 'Heating';
        break;
      case '50':
        text = 'Door Open';
        break;
      case '60':
        text = 'Wait to take away';
        break;
      case '70':
        text = 'Taken away door close';
        break;
      case '100':
        text = 'Operation error';
        break;
      case '110':
        text = 'Didn\'t take away';
        break;
      case '120':
        text = 'Miss taking Bowl';
        break;
      default:
        text = 'Unknown Operation';
    }
    setDisplayText(text);
  };

  const handleVendingSelect = (vendingNumber) => {
    setSelectedVending(vendingNumber);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            selectedVending === '01' && styles.selectedButton,
          ]}
          onPress={() => handleVendingSelect('01')}
        >
          <Text style={[
            styles.selectionText,
            selectedVending === '01' && styles.selectedText,
          ]}>Vending 01</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            selectedVending === '02' && styles.selectedButton,
          ]}
          onPress={() => handleVendingSelect('02')}
        >
          <Text style={[
            styles.selectionText,
            selectedVending === '02' && styles.selectedText,
          ]}>Vending 02</Text>
        </TouchableOpacity>
      </View>
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
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectionButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  selectionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
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