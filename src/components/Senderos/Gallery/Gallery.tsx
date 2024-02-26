import React, {useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {Colors} from '@/theme';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import GalleryModal from '@/components/Senderos/GalleryModal';

type GalleryProps = {
  imagesID: number[];
};

const Gallery: React.FC<GalleryProps> = ({imagesID}) => {
  const imagenes = useSelector(ImagenesSelectors.getImagenes);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);

  const openModal = (value: number) => () => {
    setSelected(value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderItem = (index: number, style?: ImageStyle) => {
    return (
      <Pressable onPress={openModal(index)} style={[{flex: 1}, style]}>
        <FastImage
          source={{uri: imagenes[imagesID[index]].thumb_url}}
          resizeMode="cover"
          style={{flex: 1}}
        />
      </Pressable>
    );
  };

  const count = imagesID.length;
  if (count < 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GalleryModal
        visible={modalOpen}
        onClose={closeModal}
        selected={selected}
        images={imagesID.map(image => ({uri: imagenes[image].large_url}))}
      />
      {renderItem(0, styles.image1)}
      {count >= 2 ? (
        <View style={styles.secondLine}>
          {renderItem(1)}
          {count >= 3 && renderItem(2, styles.image3)}
        </View>
      ) : null}
      {/* <Pressable onPress={openModal(0)}>
        <View>
          <FastImage
            source={{uri: imagenes[imagesID[0]].thumb_url}}
            resizeMode="cover"
            style={styles.image1}
          />
          {count >= 2 ? (
            <View style={styles.secondLine}>
              <FastImage
                source={{uri: imagenes[imagesID[1]].thumb_url}}
                resizeMode="cover"
                style={styles.image2}
              />
              {count >= 3 ? (
                <FastImage
                  source={{uri: imagenes[imagesID[2]].thumb_url}}
                  resizeMode="cover"
                  style={styles.image3}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </Pressable> */}
    </View>
  );
};
export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    zIndex: -1,
    paddingVertical: 20,
  },
  secondLine: {
    flex: 1,
    flexDirection: 'row',
    height: 150,
    marginTop: 4,
  },
  image1: {
    height: 250,
  },
  image3: {
    maxWidth: 150,
    marginLeft: 4,
  },
});
