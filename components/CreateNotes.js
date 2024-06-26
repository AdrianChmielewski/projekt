import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'http://192.168.39.78:3000';

const CreateNotes = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSaveNote = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, {
        title,
        content,
        date: date.toISOString().split('T')[0], // Ensure date is in 'YYYY-MM-DD' format
      });
      console.log('Note saved:', response.data);
      Alert.alert('Note saved successfully');
      setTitle(''); // Clear the form fields
      setContent(''); // Clear the form fields
      navigation.navigate('Calendar');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error saving note', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tworzenie Notatek</Text>
      <TextInput
        style={styles.input}
        placeholder="Tytuł Notatki"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Treść Notatki"
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>Wybierz Datę</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowPicker(false);
            setDate(currentDate);
          }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSaveNote}>
        <Text style={styles.buttonText}>Zapisz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Anuluj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateNotes;
