import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, TouchableOpacity, StyleSheet, Image } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import welcomeImage from '../assets/image.png';

function HomePage({ navigation }) {
  const [medicationName, setMedicationName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dosageTime, setDosageTime] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [medicationList, setMedicationList] = useState([]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log(token);
    });

    return () => {
      // 알림 해제 코드는 제거하세요
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateSelect = (event, selected) => {
    if (selected) {
      setSelectedDate(selected);
    }
    hideDatePickerModal();
    setShowPicker(true);
  };

  const showTimePickerModal = () => {
    setShowPicker(true);
  };

  const hideTimePickerModal = () => {
    setShowPicker(false);
  };

  const handleTimeSelect = (event, selected) => {
    if (selected) {
      setSelectedTime(selected);
      const time = selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setDosageTime(time);
    }
  };

  const saveMedication = async () => {
    if (isNameEntered && medicationName && dosageTime) {
      const formattedDate = selectedDate.toLocaleDateString();
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const medication = { name: medicationName, date: formattedDate, time: formattedTime };
      const updatedList = [...medicationList, medication];
      setMedicationList(updatedList);
      setMedicationName("");
      setIsNameEntered(false);
      setShowConfirmation(true);
      hideTimePickerModal();

      // 푸시 알림 예약
      try {
        const trigger = new Date(selectedDate);
        trigger.setHours(selectedTime.getHours());
        trigger.setMinutes(selectedTime.getMinutes());

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "알림",
            body: `${medicationName} 복용 시간입니다.`,
            sound: 'default',
          },
          trigger,
        });
        console.log('알림이 예약되었습니다.');
      } catch (error) {
        console.log('알림 예약에 실패했습니다:', error);
      }
    } else {
      setIsNameEntered(true);
    }
  };
  
  const handleConfirmation = () => {
    setShowConfirmation(false);
    navigation.navigate("CalendarPage", { medicationList: medicationList });
    navigation.navigate("LibraryPage", { medicationList: medicationList });
    navigation.navigate("MyPage", { medicationList: medicationList }); // 마이페이지로의 네비게이션 추가
  };
  
    return (
      <View style={styles.container}>
        <Image source={welcomeImage} style={styles.image} />
        <Text style={styles.title}>복용 시간을 잊지 말아요!</Text>
  
        {!isNameEntered ? (
          <TextInput
            style={styles.input}
            placeholder="약품 이름을 입력하세요 ex)타이레놀"
            value={medicationName}
            onChangeText={setMedicationName}
          />
        ) : (
          <View>
            <TouchableOpacity style={styles.dateButton} onPress={showDatePickerModal}>
              <Text style={styles.dateButtonText}>{selectedDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeButton} onPress={showTimePickerModal}>
              <Text style={styles.timeButtonText}>{selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "복용 시간 선택"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY/MM/DD"
              value={selectedDate.toLocaleDateString()}
              onChangeText={(text) => {
                const [year, month, day] = text.split("/");
                if (year && month && day) {
                  const newDate = new Date(year, month - 1, day);
                  setSelectedDate(newDate);
                }
              }}
            />
          </View>
        )}
  
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            is24Hour={false}
            display="spinner"
            onChange={handleDateSelect}
          />
        )}
  
        {showPicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleTimeSelect}
          />
        )}
  
        {!showConfirmation && (
          <View style={styles.buttonContainer}>
            <Button
              title={!isNameEntered ? "다음" : "저장"}
              onPress={saveMedication}
            />
          </View>
        )}
  
        {showConfirmation && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>약 복용 정보가 저장되었습니다.</Text>
            <Button
              title="확인"
              onPress={handleConfirmation}
            />
          </View>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 300, // 이미지의 너비 조정
      height: 300, // 이미지의 높이 조정
      resizeMode: "contain", // 이미지 크기 조정 옵션 (필요에 따라 변경 가능)
    },
      title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
    input: {
      width: "80%",
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    dateButton: {
      backgroundColor: "#DDDDDD",
      padding: 10,
      marginTop: 10,
    },
    dateButtonText: {
      fontSize: 16,
      color: "black",
    },
    timeButton: {
      backgroundColor: "#DDDDDD",
      padding: 10,
      marginTop: 10,
    },
    timeButtonText: {
      fontSize: 16,
      color: "black",
    },
    saveButton: {
      backgroundColor: "blue",
      padding: 10,
      marginTop: 10,
    },
    saveButtonText: {
      fontSize: 16,
      color: "white",
      textAlign: "center",
    },
    dateInput: {
      width: "80%",
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      marginTop: 10,
    },
    confirmationContainer: {
      alignItems: "center",
      marginTop: 10,
    },
    confirmationText: {
      fontSize: 16,
      marginBottom: 10,
    },
  });
  
  export default HomePage;