import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";

function MyPage({ route }) {
  const [medicationList, setMedicationList] = useState([]);

useEffect(() => {
  if (route.params?.medicationList) {
    setMedicationList(route.params.medicationList);
  }
}, [route.params?.medicationList]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicationIndex, setSelectedMedicationIndex] = useState(null);

  const handleMedicationCheck = (index) => {
    setSelectedMedicationIndex(index);
    setModalVisible(true);
  };

  const handleConfirmation = (confirmed) => {
    if (selectedMedicationIndex !== null) {
      const updatedList = [...medicationList];
      updatedList[selectedMedicationIndex].checked = confirmed; // Set checked status based on user confirmation
      setMedicationList(updatedList);
      setSelectedMedicationIndex(null);
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>마이 페이지</Text>

      {/* Medication List */}
      <Text style={styles.subheading}>목록</Text>
      {medicationList.map((medication, index) => (
        <TouchableOpacity
          key={index}
          style={styles.medicationInfo}
          onPress={() => handleMedicationCheck(index)}
        >
          <View style={styles.medicationRow}>
            <Text style={styles.medicationName}>{medication.name}</Text>
          </View>
          <View>
            <Text style={styles.date}>복용 날짜: {medication.date}</Text>
            <Text style={styles.dosageTime}>복용 시간: {medication.time}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Completed Medications */}
      <Text style={styles.subheading}>복용 완료</Text>
      {medicationList
        .filter((medication) => medication.checked)
        .map((medication, index) => (
          <TouchableOpacity
            key={index}
            style={styles.medicationInfo}
            onPress={() => handleMedicationCheck(index)}
          >
            <View style={styles.medicationRow}>
            <Text style={styles.medicationName}>{medication.name}</Text>
          </View>
          <View>
            <Text style={styles.date}>복용 날짜: {medication.date}</Text>
            <Text style={styles.dosageTime}>복용 시간: {medication.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {/* Pending Medications */}
      <Text style={styles.subheading}>미복용</Text>
      {medicationList
        .filter((medication) => !medication.checked)
        .map((medication, index) => (
          <TouchableOpacity
            key={index}
            style={styles.medicationInfo}
            onPress={() => handleMedicationCheck(index)}
          >
            <View style={styles.medicationRow}>
            <Text style={styles.medicationName}>{medication.name}</Text>
          </View>
          <View>
            <Text style={styles.date}>복용 날짜: {medication.date}</Text>
            <Text style={styles.dosageTime}>복용 시간: {medication.time}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalQuestion}>약품을 복용하셨습니까?</Text>
            <View style={styles.modalButtonContainer}>
              <Button title="Yes" onPress={() => handleConfirmation(true)} />
              <Button title="No" onPress={() => handleConfirmation(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
  subheading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 70,
    marginBottom: 10,
    color: "#333333",
  },
  medicationInfo: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  medicationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  date: {
    fontSize: 16,
    color: "#666666",
  },
  dosageTime: {
    fontSize: 16,
    color: "#666666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default MyPage;