import {AppRegistry, Platform, ToastAndroid} from 'react-native';

import App from './App';
import {name as appName} from './app.json';

const onScheduledTime = async () => {
  console.log('here -> Receiving Alarm in JS');
  ToastAndroid.show('Its Scheduled Time', ToastAndroid.LONG);
};

if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('HeadlessScheduler', () => onScheduledTime);
}

AppRegistry.registerComponent(appName, () => App);
