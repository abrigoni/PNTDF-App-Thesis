import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import Icons from '../../../assets/images/content/recomendaciones/index';
import {Colors} from '@/theme';
import {isEmpty} from 'lodash';

type RecommendationsProps = {
  options: number[];
};

const Recommendations: React.FC<RecommendationsProps> = ({options}) => {
  if (isEmpty(options)) {
    return null;
  }

  return (
    <View style={styles.recomendations}>
      <View style={styles.container}>
        {options.map((icon, index) => {
          return <Image key={index} source={Icons[icon]} style={styles.icon} />;
        })}
      </View>
    </View>
  );
};

export default Recommendations;

const styles = StyleSheet.create({
  recomendations: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: 10,
    alignItems: 'center',
  },
  container: {
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icon: {
    width: 60,
    height: 60,
    margin: 5,
  },
});
