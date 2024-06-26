import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const AnalyzeStats = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [meetingType, setMeetingType] = useState('');

  // Dummy data for the charts
  const meetingCount = 12;
  const averageMeetingLength = '1h 30min';
  const participantFrequencyData = [
    { name: 'Jan Kowalski', frequency: 4 },
    { name: 'Anna Nowak', frequency: 3 },
    { name: 'Piotr Zieliński', frequency: 5 },
  ];
  const meetingTopicsData = [
    { name: 'Projekt A', population: 4, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Projekt B', population: 3, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Projekt C', population: 5, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const handleDateChange = (event, selectedDate, setDate) => {
    if (event.type === 'set') {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Analiza Statystyk</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Liczba Spotkań: {meetingCount}</Text>
        <Text style={styles.sectionHeader}>Średnia Długość: {averageMeetingLength}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Frekwencja Uczestników</Text>
        <BarChart
          data={{
            labels: participantFrequencyData.map(item => item.name),
            datasets: [{ data: participantFrequencyData.map(item => item.frequency) }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Tematy Spotkań</Text>
        <PieChart
          data={meetingTopicsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Zakres Czasu</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.datePickerText}>Od: {startDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setStartDate)}
          />
        )}
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.datePickerText}>Do: {endDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setEndDate)}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Typ Spotkania"
          value={meetingType}
          onChangeText={setMeetingType}
        />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Powrót</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  datePicker: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 18,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AnalyzeStats;
