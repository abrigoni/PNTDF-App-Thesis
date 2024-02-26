import React from 'react';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';

import I18n from '@/languages/i18n';
import config from '@/config/ConfigVariables';

import BaseAppScreen from '@/containers/BaseAppScreen';
import Pdf from 'react-native-pdf';
import {ContenidosPDFSelectors} from '@/redux/ContenidosPDFSlice';

const ServiciosScreen: React.FC = props => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  // todo: servicios pdf
  const pdfPath = useSelector((state: any) =>
    ContenidosPDFSelectors.getPath(state, 'servicios'),
  );

  return (
    <BaseAppScreen title={I18n.t('Servicios', {locale: idioma})}>
      <Pdf
        style={{flex: 1}}
        source={require('../assets/pdfs/sobre-app.pdf')}
        trustAllCerts={false}
      />
    </BaseAppScreen>
  );
};
export default ServiciosScreen;
