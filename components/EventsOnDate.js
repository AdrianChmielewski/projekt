import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const EventsOnDate = ({ route }) => {
  const { date } = route.params;
  const [meetings, setMeetings] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchEventsOnDate();
  }, []);

  const fetchEventsOnDate = async () => {
    try {
      const [meetingResponse, noteResponse] = await Promise.all([
        axios.get(`http://192.168.39.78:3000/meetings/${date}`),
        axios.get(`http://192.168.39.78:3000/notes/${date}`)
      ]);
      setMeetings(meetingResponse.data);
      setNotes(noteResponse.data);
    } catch (error) {
      console.error('Error fetching events on date:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wydarzenia w dniu {date}</Text>
      <Text style={styles.subHeader}>Spotkania:</Text>
      <FlatList
        data={meetings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.eventText}>{item.title}</Text>
          </View>
        )}
      />
      <Text style={styles.subHeader}>Notatki:</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.eventText}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
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
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  event: {
    padding: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    marginBottom: 10,
  },
  eventText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventsOnDate;
