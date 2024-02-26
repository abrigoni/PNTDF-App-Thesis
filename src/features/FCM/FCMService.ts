import {useEffect} from 'react';
import {Alert, AlertButton, Linking, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import config from 'react-native-ultimate-config';

export interface UseNotificationsProps {
  onGetToken?: (token: string) => void;
  onTokenRefresh?: (token: string) => void;
  dontRequestPermissions?: boolean;
  dontRegisterToDefaultTopic?: boolean;
}

const defaultProps: Partial<UseNotificationsProps> = {
  dontRequestPermissions: false,
  dontRegisterToDefaultTopic: false,
};

export const useFCMNotifications = (propArgs?: UseNotificationsProps) => {
  const props = {...defaultProps, ...propArgs};

  // Token init or Refresh
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM getToken', token);
        if (props.onGetToken) {
          props.onGetToken(token);
        }
      });

    return messaging().onTokenRefresh(token => {
      console.log('FCM onTokenRefresh', token);
      if (props.onTokenRefresh) {
        props.onTokenRefresh(token);
      }
    });
  }, [props]);

  // Permissions
  useEffect(() => {
    if (!props.dontRequestPermissions) {
      requestNotificationsPermission();
    }
  }, [props.dontRequestPermissions]);

  // Subscribe to default topic
  useEffect(() => {
    if (!props.dontRegisterToDefaultTopic) {
      messaging()
        .subscribeToTopic(config.FCM_DEFAULT_TOPIC)
        .then(() => console.log('FCM Subscribed to topic: develop'));
    }
  }, [props.dontRegisterToDefaultTopic]);

  // Message managment
  useEffect(() => {
    // foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM onMessage', remoteMessage);
      if (remoteMessage?.notification) {
        displayNotification(remoteMessage);
      }
    });

    // background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('FCM onNotificationOpenedApp', remoteMessage);
      if (remoteMessage?.notification) {
        displayNotification(remoteMessage);
      }
    });

    // closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('FCM getInitialNotification', remoteMessage);
        if (remoteMessage?.notification) {
          displayNotification(remoteMessage);
        }
      });

    return unsubscribe;
  }, []);
};

export async function requestNotificationsPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('Authorization status: ', enabled, authStatus);

  return enabled;
}

export function FCMSetBackgroundMessageHandler(
  messageHandler: (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => void | undefined,
) {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('FCM setBackgroundMessageHandler', remoteMessage);
    if (messageHandler) {
      messageHandler(remoteMessage);
    }
  });
}

function displayNotification(remoteMsg: FirebaseMessagingTypes.RemoteMessage) {
  console.log('displayNotification', remoteMsg);

  let buttons: AlertButton[] = [{text: 'Cerrar', style: 'cancel'}];

  if (remoteMsg.data?.btn_text) {
    buttons.push({
      text: remoteMsg.data.btn_text,
      onPress: () => {
        let url =
          Platform.OS === 'ios'
            ? remoteMsg.data?.url_ios
            : remoteMsg.data?.url_android;
        if (url) {
          Linking.openURL(url);
        }
      },
    });
  }
  if (remoteMsg.notification?.title) {
    Alert.alert(
      remoteMsg.notification?.title,
      remoteMsg.notification?.body,
      buttons,
      {cancelable: false},
    );
  }
}
