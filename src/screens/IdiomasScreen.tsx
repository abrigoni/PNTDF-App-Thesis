import React, {useState} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {IdiomasSelectors} from '@/redux/IdiomasSlice';
import {Idioma} from '@/services/IdiomasService';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import I18n from '@/languages/i18n';
import {Colors} from '@/theme';

const IdiomasScreen: React.FC = () => {
  const navigation = useNavigation();

  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const idiomas = useSelector(IdiomasSelectors.getIdiomas);
  const requestIdioma = useSelector(ConfiguracionSelectors.getRequestIdioma);

  const [newIdioma, setNewIdioma] = useState<string>(idioma);

  const dispatch = useDispatch();

  const navigate = () => {
    dispatch(ConfiguracionActions.updateIdioma(newIdioma));

    if (requestIdioma) {
      dispatch(ConfiguracionActions.disableRequestIdioma());
      navigation.navigate('HOME');
    } else {
      navigation.goBack();
    }
  };

  const onValueChange = (value: string) => {
    setNewIdioma(value);
  };

  const getPickerItems = (): any[] => {
    if (idiomas) {
      return idiomas.map((id: Idioma, index: number) => ({
        key: index,
        label: id.nombre,
        value: id.langcode,
      }));
    }
    return [];
  };

  console.log(idiomas);
  console.log(idioma);
  console.log(getPickerItems());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {I18n.t('seleccionIdioma', {locale: 'en'})}:
      </Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={newIdioma} onValueChange={onValueChange}>
          {getPickerItems().map(item => (
            <Picker.Item label={item.value} value={item.value} />
          ))}
        </Picker>
      </View>
      <Pressable style={styles.button} onPress={navigate}>
        <Text style={styles.btnText}>
          {I18n.t('siguiente', {locale: idioma})}
        </Text>
        <Icon name="chevron-right" size={25} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export default IdiomasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20,
  },
  pickerContainer: {
    width: '50%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 140,
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.white,
    marginRight: 15,
  },
});
