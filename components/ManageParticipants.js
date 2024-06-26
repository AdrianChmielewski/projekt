import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';

const ManageParticipants = ({ navigation }) => {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get('http://192.168.39.78:3000/users');
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleSaveParticipant = async () => {
    try {
      await axios.post('http://192.168.39.78:3000/users', { firstName, lastName, email });
      Alert.alert('Participant created successfully');
      fetchParticipants();
      resetForm();
    } catch (error) {
      console.error('Error creating participant:', error);
      Alert.alert('Error creating participant');
    }
  };

  const handleEditParticipant = (participant) => {
    setSelectedParticipant(participant);
    setFirstName(participant.firstName);
    setLastName(participant.lastName);
    setEmail(participant.email);
    setIsModalVisible(true);
  };

  const handleUpdateParticipant = async () => {
    try {
      await axios.put(`http://192.168.39.78:3000/users/${selectedParticipant._id}`, {
        firstName,
        lastName,
        email
      });
      Alert.alert('Participant updated successfully');
      fetchParticipants();
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating participant:', error);
      Alert.alert('Error updating participant');
    }
  };

  const handleDeleteParticipant = async (participant) => {
    try {
      await axios.delete(`http://192.168.39.78:3000/users/${participant._id}`);
      Alert.alert('Participant deleted successfully');
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      Alert.alert('Error deleting participant');
    }
  };

  const resetForm = () => {
    setSelectedParticipant(null);
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zarządzanie Uczestnikami</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Add Participant" onPress={handleSaveParticipant} />
      <FlatList
        data={participants}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.participant}>
            <Text>{item.firstName} {item.lastName} ({item.email})</Text>
            <TouchableOpacity onPress={() => handleEditParticipant(item)}>
              <Text style={styles.editButton}>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteParticipant(item)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Edit Participant</Text>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Button title="Update Participant" onPress={handleUpdateParticipant} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  participant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  editButton: {
    color: 'blue',
    marginLeft: 10,
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ManageParticipants;