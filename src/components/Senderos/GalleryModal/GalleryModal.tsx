import React from 'react';
import {View, Pressable, Modal, StyleSheet} from 'react-native';

import {Colors} from '@/theme';

import FastImage from 'react-native-fast-image';
import GallerySwiper from 'react-native-gallery-swiper';
import Icon from 'react-native-vector-icons/FontAwesome5';

type GalleryModalProps = {
  images: any[];
  visible: boolean;
  selected?: number;
  onClose: () => void;
};

const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  visible,
  selected,
  onClose,
}) => {
  return (
    <Modal onRequestClose={onClose} animationType="fade" visible={visible}>
      <View style={styles.modalContent}>
        <View style={styles.btnCloseContainer}>
          <Pressable style={styles.btnClose} onPress={onClose}>
            <Icon name="times" size={25} color={Colors.white} />
          </Pressable>
        </View>
        <GallerySwiper
          initialPage={selected}
          imageComponent={imageProps => {
            const newProps = imageProps as any;
            return <FastImage {...newProps} />;
          }}
          images={images}
        />
      </View>
    </Modal>
  );
};
export default GalleryModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
  },
  btnCloseContainer: {
    alignSelf: 'flex-end',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  btnClose: {
    margin: 10,
  },
});
