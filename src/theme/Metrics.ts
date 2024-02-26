import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width, height} = Dimensions.get('window');

// Used via Metrics.baseMargin
const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  statusBarHeight: getStatusBarHeight(),
  statusBarHeightIgnoreAndroid: getStatusBarHeight(true),
  navBarHeight: Platform.OS === 'ios' ? 64 : 54,
};

export default metrics;
