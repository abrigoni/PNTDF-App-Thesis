import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {
  EmergenciasActions,
  EmergenciasSelectors,
  ImagenEmergencia,
} from '@/redux/EmergenciasSlice';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Metrics} from '@/theme';
import FastImage from 'react-native-fast-image';
import I18n from '@/languages/i18n';

import EmptyContent from '@/components/ui/EmptyContent';
// todo move to ui
import GalleryModal from '@/components/Senderos/GalleryModal';
import BaseAppScreen from '@/containers/BaseAppScreen';
import {Button} from 'react-native-paper';
import {isEmpty} from 'lodash';

const GaleriaEmergenciaScreen: React.FC = props => {
  const dispatch = useDispatch();

  const fotografias = useSelector(EmergenciasSelectors.getFotografias);
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<ImagenEmergencia[]>([]);
  const [selected, setSelected] = useState<number>(0);

  let shakeValue = new Animated.Value(0);

  const startDelete = () => {
    setDeleteMode(true);
  };

  useEffect(() => {
    if (deleteMode) {
      Animated.loop(
        Animated.timing(shakeValue, {
          toValue: 4,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      setDeleteList([]);
    }
  }, [deleteMode]);

  const isSelected = (item: ImagenEmergencia) => {
    return deleteList.includes(item);
  };

  const onPhotoPress = (image: ImagenEmergencia, index: number) => () => {
    if (deleteMode) {
      if (isSelected(image)) {
        setDeleteList(deleteList.filter(e => e != image));
      } else {
        setDeleteList([...deleteList, image]);
      }
    } else {
      openModal(index);
    }
  };

  const onDeletePress = () => {
    deleteList.forEach(imagen => {
      dispatch(EmergenciasActions.eliminarFotografia(imagen.ruta));
    });
    setDeleteMode(false);
  };

  const renderPhoto = ({item, index}: ListRenderItemInfo<ImagenEmergencia>) => {
    return (
      <Pressable onPress={onPhotoPress(item, index)} onLongPress={startDelete}>
        <View style={styles.imageContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  rotateZ: shakeValue.interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg'],
                  }),
                },
              ],
            }}>
            <FastImage
              style={styles.image}
              source={{priority: FastImage.priority.high, uri: item.ruta}}
              resizeMode="cover">
              {isSelected(item) ? (
                <View style={styles.selectedOverlay} />
              ) : null}
            </FastImage>
          </Animated.View>
          <Text style={styles.label}>{item.fecha_str}</Text>
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <EmptyContent
      icon="images"
      text={I18n.t('Galería vacía', {locale: idioma})}
    />
  );

  const openModal = (value: number) => {
    setSelected(value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <BaseAppScreen title={I18n.t('Emergencias', {locale: idioma})}>
      {deleteMode ? (
        <View style={styles.deleteContainer}>
          <Button
            onPress={() => setDeleteMode(false)}
            color={Colors.blue}
            style={styles.btnDeleteClose}>
            <Icon name="times" />
          </Button>
          <Text style={{flex: 1}}>
            {deleteList.length}{' '}
            {I18n.t('elementos seleccionados', {lang: idioma})}.
          </Text>
          <Button onPress={onDeletePress} color={Colors.blue}>
            <Text>{I18n.t('Confirmar', {lang: idioma})}</Text>
          </Button>
        </View>
      ) : null}
      <FlatList
        keyExtractor={(img, index) => `${index}`}
        data={fotografias}
        renderItem={renderPhoto}
        numColumns={3}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          isEmpty(fotografias) ? null : styles.listContainer
        }
      />
      <GalleryModal
        visible={modalOpen}
        selected={selected}
        images={fotografias.map(pic => ({uri: pic.ruta}))}
        onClose={closeModal}
      />
    </BaseAppScreen>
  );
};

export default GaleriaEmergenciaScreen;

const styles = StyleSheet.create({
  listContainer: {
    width: (Metrics.screenWidth / 3.5 + 10) * 3,
    paddingVertical: 15,
    alignSelf: 'center',
  },
  imageContainer: {
    paddingHorizontal: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: Metrics.screenWidth / 3.5,
    height: Metrics.screenWidth / 3.5,
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 3,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  selectedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(230,100,100,0.6)',
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    backgroundColor: 'lightgray',
  },
  btnDeleteClose: {
    width: 30,
    height: 30,
  },
});
