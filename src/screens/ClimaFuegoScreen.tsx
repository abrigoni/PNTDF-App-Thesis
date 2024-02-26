import React from 'react';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import I18n from '@/languages/i18n';

import BaseAppScreen from '@/containers/BaseAppScreen';
import {ContenidosPDFSelectors} from '@/redux/ContenidosPDFSlice';
import Pdf from 'react-native-pdf';

const ClimaFuegoScreen: React.FC = props => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const pdfPath = useSelector((state: any) =>
    ContenidosPDFSelectors.getPath(state, 'clima-fuego'),
  );

  return (
    <BaseAppScreen title={I18n.t('Clima y fuego', {locale: idioma})}>
      <Pdf
        trustAllCerts={false}
        style={{flex: 1}}
        source={require('../assets/pdfs/clima-fuego.pdf')}
      />
    </BaseAppScreen>
  );
};
export default ClimaFuegoScreen;
