import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import config from '@/config/ConfigVariables';
import Colors from '@/theme/Colors';
import Images from '@/theme/Images';
import I18n from '@/languages/i18n';
import codePush from 'react-native-code-push';
import metrics from '@/theme/Metrics';

const AppUpdating: React.FC = () => {
  const [codePushVersionLabel, setCodePushVersionLabel] = useState<
    string | null
  >(null);

  useEffect(() => {
    codePush.getUpdateMetadata().then(metaData => {
      if (!codePushVersionLabel && metaData?.label) {
        setCodePushVersionLabel(metaData.label);
      }
    });
  }, [codePushVersionLabel]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.splashBackground} />
      <SafeAreaView>
        <View style={styles.imageContainer}>
          <Image source={Images.logo} style={styles.splashImage} />
          <View style={styles.updatingIndicatorContainer}>
            <ActivityIndicator
              animating
              color={Colors.splashText}
              size="large"
              style={styles.indicator}
            />
            <Text style={[styles.versionText, styles.fontLarge]}>
              {I18n.t('codepush.updating')}
            </Text>
          </View>
        </View>
        <View style={styles.versionTextContainer}>
          <Text style={styles.versionText}>
            {`v${config.APP_VERSION}` +
              (codePushVersionLabel ? ` (CD ${codePushVersionLabel})` : '')}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.splashBackground,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionTextContainer: {
    paddingBottom: 5,
  },
  versionText: {
    color: Colors.splashText,
    textAlign: 'center',
  },
  updatingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  indicator: {marginRight: 10},
  fontLarge: {fontSize: 16},
  splashImage: {
    width: metrics.screenWidth * 0.7,
    resizeMode: 'contain',
  },
});

export default AppUpdating;
