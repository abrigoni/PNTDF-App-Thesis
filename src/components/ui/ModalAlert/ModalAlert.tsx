import React from 'react';
import {Text, View, Modal, Pressable, StyleSheet} from 'react-native';

import I18n from '@/languages/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useSelector} from 'react-redux';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {Colors} from '@/theme';

type ModalAlertProps = {
  visible: boolean;
  onClose: () => void;
};

const ModalAlert: React.FC<ModalAlertProps> = ({visible, onClose}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modal}>
        <Icon name="clock" size={52} color={Colors.white} />
        <Text textBreakStrategy="simple" style={styles.text}>
          {I18n.t('TextoAlerta', {locale: idioma})}
        </Text>
        <Pressable style={styles.btnClose} onPress={onClose}>
          <Text style={styles.btnText}>
            {I18n.t('CerrarAlerta', {locale: idioma})}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ModalAlert;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    paddingTop: 80,
  },
  text: {
    color: Colors.white,
    width: '80%',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
  btnClose: {
    marginTop: 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnText: {
    textTransform: 'uppercase',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
