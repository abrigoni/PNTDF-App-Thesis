import codePush from 'react-native-code-push';
import {reset} from '@/navigation/RootNavigation';

export function codepushStatusListener(status: codePush.SyncStatus) {
  switch (status) {
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
    case codePush.SyncStatus.INSTALLING_UPDATE:
      reset({index: 0, routes: [{name: 'APP_UPDATING'}]});
      break;
    case codePush.SyncStatus.UPDATE_INSTALLED:
      console.log('UPDATE INSTALED');
      break;
    default:
      break;
  }
}
