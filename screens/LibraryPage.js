import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

function LibraryPage({ route }) {
  const [medicationList, setMedicationList] = useState([]);

useEffect(() => {
  if (route.params?.medicationList) {
    setMedicationList(route.params.medicationList);
  }
}, [route.params?.medicationList]);

  const handleDeleteMedication = (index) => {
    Alert.alert(
      "목록 삭제",
      "선택한 약품을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            const updatedList = [...medicationList];
            updatedList.splice(index, 1);
            setMedicationList(updatedList);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>약품 목록</Text>
      {medicationList.map((medication, index) => (
        <View key={index} style={styles.medicationInfo}>
          <Text style={styles.medicationName}>약품 이름: {medication.name}</Text>
          <Text style={styles.date}>
            복용 날짜: <Text style={styles.dateText}>{medication.date}</Text>
          </Text>
          <Text style={styles.dosageTime}>복용 시간: {medication.time}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteMedication(index)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  medicationInfo: {
    marginBottom: 10,
    marginLeft: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    width: "80%",
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  dosageTime: {
    fontSize: 16,
    color: "#666666",
  },
  date: {
    fontSize: 16,
    color: "#666666",
  },
  dateText: {
    fontSize: 16,
    color: "#666666",
  },
  deleteButton: {
    marginTop: 1,
    backgroundColor: "#ff3333",
    borderRadius: 5,
    padding: 1,
    width: "25%",
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
});

export default LibraryPage;
