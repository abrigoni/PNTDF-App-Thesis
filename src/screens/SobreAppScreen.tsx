import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import I18n from '@/languages/i18n';
import config from '@/config/ConfigVariables';

import {AppHeaderOption} from '@/components/ui/AppHeader/AppHeader';
import BaseAppScreen from '@/containers/BaseAppScreen';
import {ContenidosPDFSelectors} from '@/redux/ContenidosPDFSlice';
import Pdf from 'react-native-pdf';
import {Routes} from '@/navigation/types';

const SobreAppScreen: React.FC = props => {
  const navigation = useNavigation();
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const settingsBtn: AppHeaderOption = {
    icon: 'cog',
    onPress: () => navigation.navigate(Routes.IDIOMAS),
  };

  return (
    <BaseAppScreen
      title={I18n.t('Sobre esta app', {locale: idioma})}
      headerProps={{options: [settingsBtn]}}>
      <Pdf
        style={{flex: 1}}
        source={require('../assets/pdfs/sobre-app.pdf')}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        trustAllCerts={false}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </BaseAppScreen>
  );
};
export default SobreAppScreen;
