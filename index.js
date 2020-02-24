/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {I18nManager} from 'react-native';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
I18nManager.forceRTL(true);

AppRegistry.registerComponent(appName, () => App);
