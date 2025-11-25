import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const StockReplenishment = () => {
  const [selectedVending, setSelectedVending] = useState('vending_01');
  const [data, setData] = useState([]);
  const [editableValue, setEditableValue] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const fetchData = async () => {
    try {
      setIsLoading(true); // Start loading indicator
      const response = await axios.get(`http://8.219.64.146:3001/fetch-data?vending=${selectedVending}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const handleUpdate = async (id) => {
    try {
      const newValue = editableValue[id];
      if (parseInt(newValue) > 8) {
        Alert.alert('Error', 'Value cannot be greater than 8.');
        return;
      }
  
      await axios.post(`http://8.219.64.146:3001/update-data`, { id, value: newValue, vending: selectedVending });
      fetchData(); // Refresh data after update
      setIsEditing({ ...isEditing, [id]: false });
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEdit = (id) => {
    setIsEditing({ ...isEditing, [id]: true });
    setEditableValue({ ...editableValue, [id]: data.find(item => item.ID === id).TypeValue.toString() });
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
      <Button title="Fetch Data" onPress={fetchData} disabled={isLoading} />
      {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Compartment</Text>
          <Text style={styles.tableHeader}>Bowls</Text>
          <Text style={styles.tableHeader}>Action</Text>
        </View>
        {data.map((item) => (
          <View key={item.ID} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.TypeName}</Text>
            {isEditing[item.ID] ? (
              <TextInput
                style={[styles.tableCell, styles.input]}
                value={editableValue[item.ID]}
                onChangeText={(text) => setEditableValue({ ...editableValue, [item.ID]: text })}
              />
            ) : (
              <Text style={styles.tableCell}>{item.TypeValue}</Text>
            )}
            {isEditing[item.ID] ? (
              <Button title="Update" onPress={() => handleUpdate(item.ID)} />
            ) : (
              <Button title="Edit" onPress={() => handleEdit(item.ID)} />
            )}
          </View>
        ))}
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
});

export default StockReplenishment;
