import React from 'react';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import I18n from '@/languages/i18n';
import config from '@/config/ConfigVariables';

import BaseAppScreen from '@/containers/BaseAppScreen';
import {ContenidosPDFSelectors} from '@/redux/ContenidosPDFSlice';
import Pdf from 'react-native-pdf';

const RecomendacionesScreen: React.FC = props => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const pdfPath = useSelector((state: any) =>
    ContenidosPDFSelectors.getPath(state, 'recomendaciones'),
  );

  return (
    <BaseAppScreen title={I18n.t('Recomendaciones', {locale: idioma})}>
      <Pdf
        trustAllCerts={false}
        style={{flex: 1}}
        source={require('../assets/pdfs/recomendaciones.pdf')}
      />
    </BaseAppScreen>
  );
};
export default RecomendacionesScreen;
