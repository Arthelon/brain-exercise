import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-community/async-storage"
import PropTypes from "prop-types";
import { Notifications } from "expo";
import scheduleNotifications from "../../scripts/notification-logic";
import { defaultSettings } from "./SettingsScreen.jsx";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignContent: "center",
    backgroundColor: "#f5f5f5",
    marginVertical: 30,
    marginHorizontal: 30,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    marginVertical: 30,
  },
  button: {
    backgroundColor: "#2a652c",
    borderRadius: 10,
    marginTop: 20,
  }
});

function TimePicker({ navigation, route }) {

  const [date, setDate] = useState(route.params.scheduledTime || defaultSettings.scheduledTime);

  const storeSettings = async () => {
    const settingsObj = route.params;
    settingsObj.scheduledTime = date;
    const jsonSettings = JSON.stringify(settingsObj);
    await AsyncStorage.setItem("SETTINGS", jsonSettings);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  function confirmTime() {
    Notifications.cancelAllScheduledNotificationsAsync();
    scheduleNotifications(date);
    storeSettings();
    navigation.goBack()
  }

  return (
    <View style={styles.root}>
      <Text style={styles.text}>You will receive a notification at this time on Monday through Friday</Text>
      <DateTimePicker 
        testID="dateTimePicker"
        value={date}
        mode="time"
        is24Hour={false}
        display="default"
        onChange={onChange}
      />
      <Button
        buttonStyle={styles.button}
        title="Confirm Time"
        type="solid"
        onPress={confirmTime}
      />
    </View>
  );
}

TimePicker.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default TimePicker;
