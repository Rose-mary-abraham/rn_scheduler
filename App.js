import React, {useState} from 'react';
import {
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ToastAndroid,
} from 'react-native';

const App = () => {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [isHourGuideShown, setHourGuide] = useState(false);

  // Native Module to set alarm at input time
  const scheduleTask = async () => {
    const isAlreadyScheduled = await NativeModules.Scheduler.isBgServiceRunning();
    if (isAlreadyScheduled) {
      ToastAndroid.show('Already Scheduled', ToastAndroid.SHORT);
      return;
    }
    console.log('here -> Setting alarm from JS');
    NativeModules.Scheduler.scheduleTask(Number(hour), Number(minute));
  };

  const showHourGuide = () => setHourGuide(true);
  const hideHourGuide = () => setHourGuide(false);

  const validateInput = (inputType, input) => {
    let inputValue = input.trim();
    const hourRegex = /\b([0-9]|1[0-9]|2[0-3])\b/;
    const minuteRegex = /\b([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])\b/;
    if (
      inputType === 'hr' &&
      (hourRegex.test(inputValue) || inputValue === '')
    ) {
      setHour(inputValue);
    }
    if (
      inputType === 'min' &&
      (minuteRegex.test(inputValue) || inputValue === '')
    ) {
      setMinute(inputValue);
    }
  };

  const onHourChange = hr => validateInput('hr', hr);
  const onMinuteChange = min => validateInput('min', min);

  const isDisabled = [hour, minute].includes('');

  return (
    <View style={styles.root}>
      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Hour</Text>
          <TextInput
            value={hour}
            onFocus={showHourGuide}
            onBlur={hideHourGuide}
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={onHourChange}
          />
          <View style={styles.guideContainer}>
            {isHourGuideShown && (
              <Text style={styles.guide}>Enter time in 24 hr format</Text>
            )}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Minute</Text>
          <TextInput
            value={minute}
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={onMinuteChange}
          />
          <View style={styles.guideContainer} />
        </View>
      </View>
      <TouchableOpacity
        onPress={scheduleTask}
        style={[styles.button, isDisabled && styles.disabled]}
        disabled={isDisabled}>
        <Text style={[styles.buttonText, isDisabled && styles.disabledText]}>
          Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 10,
    padding: 15,
    width: '60%',
  },
  disabled: {
    backgroundColor: 'lightgrey',
    borderColor: 'lightgrey',
  },
  disabledText: {
    color: 'white',
  },
  guide: {
    color: 'gray',
    padding: 5,
    fontSize: 10,
  },
  guideContainer: {
    height: 20,
  },
  input: {
    borderColor: 'lightgrey',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  inputContainer: {
    width: '40%',
  },
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
    width: '100%',
  },
  text: {
    alignSelf: 'flex-start',
    color: 'grey',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingLeft: 5,
  },
});

export default App;
