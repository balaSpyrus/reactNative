/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import App from './App';
import { name as appName } from './app.json';
import { checkPermission } from './src/utils';
import setupNotifications from './src/services/NotificationService';

checkPermission(PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    permissions => request(permissions).then(setupNotifications), setupNotifications);
AppRegistry.registerComponent(appName, () => App);
