import React, {useState} from 'react';
import {
  Text,
  View,
  Pressable,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';

import I18n from '@/languages/i18n';
import HTML from 'react-native-render-html';
import {Colors} from '@/theme';

type DescriptionProps = {
  resume: string;
  content?: string;
};

const Description: React.FC<DescriptionProps> = ({resume, content}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const [expanded, setExpanded] = useState<boolean>(false);

  const showMore = (value: GestureResponderEvent) => {
    if (content) {
      setExpanded(!expanded);
    }
  };

  return (
    <View style={styles.description}>
      <Pressable onPress={showMore}>
        <HTML
          source={{html: resume}}
          /* containerStyle={styles.textContainer}  */
          baseStyle={styles.text}
          ignoredDomTags={['span']}
        />
        {content && expanded ? (
          <HTML
            source={{html: content}}
            baseStyle={styles.text}
            ignoredDomTags={['span']} // todo check ignored tags
          />
        ) : null}
      </Pressable>
      {content ? (
        <View style={styles.btnContainer}>
          <Pressable style={styles.btn} onPress={showMore}>
            <Text style={styles.btnText}>
              {expanded
                ? I18n.t('leerMenos', {locale: idioma})
                : I18n.t('leerMas', {locale: idioma})}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  description: {
    width: '100%',
    /* height: 250, */
    backgroundColor: 'white',
    padding: 15,
    borderColor: Colors.green,
    borderBottomWidth: 3,
  },
  textContainer: {
    flex: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  text: {
    fontSize: 18,
  },
  btn: {
    backgroundColor: Colors.green,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  btnContainer: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
  },
  btnText: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});
