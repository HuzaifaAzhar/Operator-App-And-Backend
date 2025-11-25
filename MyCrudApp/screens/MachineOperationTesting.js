import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const MachineOperationTesting = () => {
  const [selectedVending, setSelectedVending] = useState('vending_02'); // Default to vending_02
  const [operationVariable, setOperationVariable] = useState('');
  const [editableValue, setEditableValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedVending]); // Fetch data whenever selectedVending changes

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://8.219.64.146:3001/fetch-operation-variable?vending=${selectedVending}`);
      setOperationVariable(response.data[0].TypeValue.toString());
      setEditableValue(''); // Reset editableValue when fetching new data
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {

      await axios.post(`http://8.219.64.146:3001/update-operation-variable`, { value: editableValue, vending: selectedVending });
      setIsEditing(false);
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Picker
        selectedValue={selectedVending}
        onValueChange={(itemValue) => {
          setSelectedVending(itemValue);
          setIsEditing(false); // Reset editing state when changing vending machine
        }}
        style={styles.picker}
      >
        <Picker.Item label="Vending 01" value="vending_01" />
        <Picker.Item label="Vending 02" value="vending_02" />
      </Picker>
      <Button title="Fetch Data" onPress={fetchData} disabled={isLoading} />
      {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Operation Variable</Text>
          {isEditing ? (
            <TextInput
              style={[styles.tableCell, styles.input]}
              value={editableValue}
              onChangeText={(text) => setEditableValue(text)}
            />
          ) : (
            <Text style={styles.tableCell}>{operationVariable}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <Button title="Update" onPress={handleUpdate} />
          ) : (
            <Button title="Edit" onPress={() => setIsEditing(true)} />
          )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default MachineOperationTesting;
