import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import Calendar from "../components/Calendar/Calendar";

function CalendarPage({ route }) {
  const { medicationList } = route.params || [];
  const [selectedDate, setSelectedDate] = useState(null);
  const [savedInfo, setSavedInfo] = useState({});
  const [showMedicationList, setShowMedicationList] = useState(false);

  useEffect(() => {
    if (medicationList && medicationList.length > 0) {
      const infoMap = {};
      for (const medication of medicationList) {
        const { date, time, name } = medication;
        const info = `${time}: ${name}`;
        if (!infoMap[date]) {
          infoMap[date] = [];
        }
        infoMap[date].push(info);
      }
      setSavedInfo(infoMap);
    }
  }, [medicationList]);

  const getInfoForDate = (date) => {
    return savedInfo[date] || [];
  };

  const handleDateTouch = (date) => {
    setSelectedDate(date);
    const infoForSelectedDate = getInfoForDate(date);
    setInfoForSelectedDate(infoForSelectedDate);
  };

  const handleShowMedicationList = () => {
    setShowMedicationList(!showMedicationList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar onDateSelect={handleDateTouch} />
      </View>
      <View style={styles.medicationContainer}>
        <Button
          title={showMedicationList ? "목록 숨기기" : "목록 보기"}
          onPress={handleShowMedicationList}
        />
        {showMedicationList && (
          <ScrollView style={styles.scrollView}>
            {medicationList.map((medication, index) => (
              <View key={index} style={styles.medicationInfo}>
                <Text style={styles.medicationName}>약품 이름: {medication.name}</Text>
                <Text style={styles.medicationDetail}>복용 날짜: {medication.date}</Text>
                <Text style={styles.medicationDetail}>복용 시간: {medication.time}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#f0f0f0",
  },
  calendarContainer: {
    marginBottom: 16,
  },
  medicationContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 200, // Adjust the maximum height as needed
  },
  medicationInfo: {
    marginBottom: 16,
  },
  medicationName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  medicationDetail: {
    fontSize: 14,
  },
});

export default CalendarPage;
