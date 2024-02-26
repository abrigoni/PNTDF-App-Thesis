import React, {useEffect} from 'react';
import {Alert, Platform, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import I18n from '@/languages/i18n';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {Images} from '@/theme';
import AppScreen from '@/containers/BaseAppScreen';
import HomeCard from '@/components/Home/Card';
import {
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {AppNavigatorStackParamList, Routes} from '@/navigation/types';
/* import FireAlert from '@/Components/FireAlert'; */

const HomeScreen = () => {
  const navigation = useNavigation();
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  const goTo = (screenName: any) => {
    navigation.navigate(screenName);
  };

  const requestPermission = async () => {
    const permissions: Permission[] = [
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    ];

    if (Platform.OS === 'android') {
      permissions.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }

    return requestMultiple(permissions).then(result => {
      permissions.some(permission => {
        if (result[permission] !== RESULTS.GRANTED) {
          Alert.alert(
            I18n.t('Alerta', {locale: idioma}),
            I18n.t('Aviso Permisos', {locale: idioma}),
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate(Routes.HOME),
                style: 'default',
              },
            ],
            {cancelable: false},
          );
          return true;
        }
      });
    });
  };

  useEffect(() => {
    // requestPermission();
  }, []);

  return (
    <AppScreen
      home
      title={I18n.t('Parque Nacional Tierra del Fuego', {locale: idioma})}>
      {/* <FireAlert date="13/02/2020" /> */}
      <ScrollView contentContainerStyle={styles.container}>
        <HomeCard
          title={I18n.t('Senderos', {locale: idioma})}
          background={Images.senderos}
          size="large"
          logo={Images.pnTDFLogo}
          onPress={goTo.bind(this, Routes.SENDEROS)}
        />
        <HomeCard
          title={I18n.t('Especies', {locale: idioma})}
          background={Images.especies}
          onPress={goTo.bind(this, Routes.ESPECIES)}
        />
        <HomeCard
          title={I18n.t('Emergencias', {locale: idioma})}
          background={Images.emergencias}
          onPress={goTo.bind(this, Routes.EMERGENCIA)}
        />
        <HomeCard
          title={I18n.t('Clima y fuego', {locale: idioma})}
          background={Images.climaFuego}
          onPress={goTo.bind(this, Routes.CLIMA_FUEGO)}
        />
        <HomeCard
          title={I18n.t('Servicios', {locale: idioma})}
          background={Images.servicios}
          onPress={goTo.bind(this, Routes.SERVICIOS)}
        />
        <HomeCard
          title={I18n.t('Recomendaciones', {locale: idioma})}
          background={Images.recomendaciones}
          onPress={goTo.bind(this, Routes.RECOMENDACIONES)}
        />
        <HomeCard
          title={I18n.t('Sobre esta app', {locale: idioma})}
          background={Images.sobreApp}
          onPress={goTo.bind(this, Routes.SOBRE_APP)}
        />
        <HomeCard
          title={'Clasificador de Flores'}
          background={Images.sobreApp}
          onPress={goTo.bind(this, Routes.CLASIFICADOR)}
        />
      </ScrollView>
    </AppScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
