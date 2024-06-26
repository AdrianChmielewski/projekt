import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'http://192.168.39.78:3000';

const CreateMeeting = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('');

  const meetingTopics = [
    'Planowanie Strategiczne',
    'Status Projektu',
    'Spotkanie z Klientem',
    'Brainstorming',
    'Ocena Wydajności',
    'Szkolenie i Rozwój',
    'Spotkanie Zespołu',
    'Zarządzanie Ryzykiem',
    'Budżetowanie',
    'Analiza Rynku',
  ];

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleCreateMeeting = async () => {
    if (!meetingTopic) {
      Alert.alert('Please select a meeting topic.');
      return;
    }

    const participantIds = selectedParticipants.map(p => p._id);

    const meetingData = {
      date: date.toISOString().split('T')[0],
      topic: meetingTopic,
      participants: participantIds,
    };

    console.log('Sending meeting data:', meetingData);

    try {
      const response = await axios.post(`${API_BASE_URL}/meetings`, meetingData);
      console.log('Response:', response.data);
      Alert.alert('Meeting created successfully');
      navigation.navigate('Calendar');
    } catch (error) {
      console.error('Error creating meeting:', error.response || error.message);
      console.log('Response data:', error.response?.data);
      Alert.alert('Error creating meeting', error.response?.data?.message || error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tworzenie Spotkań</Text>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>Data: {date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date;
              setShowDatePicker(false);
              setDate(currentDate);
            }}
          />
        )}
      </View>
      <Text>Temat Spotkania:</Text>
      {meetingTopics.map(topic => (
        <TouchableOpacity key={topic} onPress={() => setMeetingTopic(topic)} style={[styles.topicButton, meetingTopic === topic && styles.selectedTopic]}>
          <Text style={styles.topicButtonText}>{topic}</Text>
        </TouchableOpacity>
      ))}
      <Text>Participants:</Text>
      {participants.map(participant => (
        <TouchableOpacity
          key={participant._id}
          style={[
            styles.participant,
            selectedParticipants.includes(participant) && styles.selectedParticipant,
          ]}
          onPress={() => {
            if (selectedParticipants.includes(participant)) {
              setSelectedParticipants(selectedParticipants.filter(p => p._id !== participant._id));
            } else {
              setSelectedParticipants([...selectedParticipants, participant]);
            }
          }}
        >
          <Text>{participant.firstName} {participant.lastName} ({participant.email})</Text>
        </TouchableOpacity>
      ))}
      <Button title="Create Meeting" onPress={handleCreateMeeting} />
    </ScrollView>
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
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 18,
  },
  topicButton: {
    backgroundColor: '#e7e7e7',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedTopic: {
    backgroundColor: '#d3d3d3',
  },
  topicButtonText: {
    fontSize: 18,
  },
  participant: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e7e7e7',
  },
  selectedParticipant: {
    backgroundColor: '#d3d3d3',
  },
});

export default CreateMeeting;