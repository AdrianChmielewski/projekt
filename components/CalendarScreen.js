import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.39.78:3000';

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [showMeetingPanel, setShowMeetingPanel] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchEvents(selectedDate);
    }
  }, [selectedDate]);

  const fetchEvents = async (date) => {
    try {
      const [meetingsResponse, notesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/meetings/byDate?date=${date}`),
        axios.get(`${API_BASE_URL}/notes/byDate?date=${date}`)
      ]);
      setMeetings(meetingsResponse.data);
      setNotes(notesResponse.data);
      setEvents([...meetingsResponse.data, ...notesResponse.data]);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const onDateChange = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    if (selectedDate === formattedDate) {
      setShowMeetingPanel(false);
      setShowModal(false);
      setSelectedDate(null);
    } else {
      setSelectedDate(formattedDate);
      fetchEvents(formattedDate);
    }
  };

  const renderCustomDay = ({ date, state }) => {
    const day = date.format('YYYY-MM-DD');
    const hasMeeting = meetings.some(meeting => meeting.date === day);
    const hasNote = notes.some(note => note.date === day);

    return (
      <TouchableOpacity style={[styles.dayContainer, state === 'disabled' && styles.disabledDay]}>
        <Text style={[styles.dayText, state === 'disabled' && styles.disabledText]}>{date.date()}</Text>
        {hasMeeting && <View style={styles.meetingIndicator}></View>}
        {hasNote && <View style={styles.noteIndicator}></View>}
      </TouchableOpacity>
    );
  };

  const closeNoteModal = () => setShowModal(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kalendarz Spotkań</Text>
      <CalendarPicker
        onDateChange={onDateChange}
        customDayRenderer={renderCustomDay}
      />
      {selectedDate && showMeetingPanel && (
        <View style={styles.panel}>
          <Text style={styles.panelHeader}>Wydarzenia na {selectedDate}:</Text>
          {meetings.length > 0 ? (
            meetings.map(meeting => (
              <View key={meeting._id} style={styles.meetingContainer}>
                <Text style={styles.meetingTopic}>{meeting.topic}</Text>
                <Text style={styles.meetingParticipants}>
                  {meeting.participants.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                </Text>
              </View>
            ))
          ) : (
            <Text>Brak spotkań</Text>
          )}
        </View>
      )}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={closeNoteModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Notatki na {selectedDate}:</Text>
            <ScrollView>
              {notes.map(note => (
                <View key={note._id} style={styles.noteContainer}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <Text style={styles.noteContent}>{note.content}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeNoteModal}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateNotes')}>
          <Text style={styles.buttonText}>Tworzenie Notatek</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateMeeting')}>
          <Text style={styles.buttonText}>Tworzenie Spotkań</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageParticipants')}>
          <Text style={styles.buttonText}>Zarządzanie Uczestnikami</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AnalyzeStats')}>
          <Text style={styles.buttonText}>Analiza Statystyk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Wyloguj</Text>
        </TouchableOpacity>
      </View>
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
  },
  panel: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 10,
  },
  panelHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meetingContainer: {
    marginBottom: 10,
  },
  meetingTopic: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetingParticipants: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteContainer: {
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  dayText: {
    fontSize: 14,
  },
  disabledDay: {
    backgroundColor: '#e7e7e7',
  },
  disabledText: {
    color: '#d3d3d3',
  },
  meetingIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  noteIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'blue',
  },
});

export default CalendarScreen;
