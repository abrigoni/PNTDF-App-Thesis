import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import codePush from 'react-native-code-push';
import Colors from '@/theme/Colors';
import Images from '@/theme/Images';
import Metrics from '@/theme/Metrics';
import config from '@/config/ConfigVariables';

const SplashScreen: React.FC = () => {
  const [codePushVersionLabel, setCodePushVersionLabel] = useState<
    string | null
  >(null);
  const navigation = useNavigation();
  useEffect(() => {
    RNBootSplash.hide({fade: true}).then(() => {
      setTimeout(() => {
        navigation.reset({index: 0, routes: [{name: 'APP_NAVIGATOR'}]});
      }, 2000);
    });
  }, [navigation]);

  useEffect(() => {
    codePush.getUpdateMetadata().then(metaData => {
      if (!codePushVersionLabel && metaData?.label) {
        setCodePushVersionLabel(metaData.label);
      }
    });
  }, [codePushVersionLabel]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor={Colors.splashBackground} />
      <SafeAreaView>
        <View style={styles.splashImageContainer}>
          <Image source={Images.pnTDFLogo} style={styles.splashImage} />
        </View>
        <View style={styles.splashVersionTextContainer}>
          <Text style={styles.splashVersionText}>
            {`v${config.APP_VERSION}` +
              (codePushVersionLabel ? ` (CD ${codePushVersionLabel})` : '')}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.splashBackground,
    alignItems: 'center',
  },
  splashImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashVersionTextContainer: {
    paddingBottom: 5,
  },
  splashVersionText: {
    color: Colors.splashText,
    textAlign: 'center',
  },
  splashImage: {
    width: Metrics.screenWidth * 0.7,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
