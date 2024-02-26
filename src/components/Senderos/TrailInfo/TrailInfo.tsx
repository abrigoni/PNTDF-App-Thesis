import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import I18n from '@/languages/i18n';
import {Duration} from 'luxon';
import {toString} from 'lodash';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dificultad} from '@/services/DificultadesService';
import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {Colors} from '@/theme';

type Daylight = {
  [key: number]: [number, number];
};

const daylight: Daylight = {
  1: [5.25, 21.57],
  2: [6.22, 21.1],
  3: [7.25, 20],
  4: [8.25, 18.4],
  5: [9.2, 17.45],
  6: [9.5, 17.2],
  7: [9.45, 17.4],
  8: [8.5, 18.3],
  9: [7.3, 19.25],
  10: [6.25, 20.15],
  11: [5.2, 21.2],
  12: [4.5, 22.06],
};

export const isLate = (duration: number) => {
  const month = new Date().getMonth() + 1;
  const hour = new Date().getHours();
  const minutes = new Date().getMinutes();
  let durationInHrs = 0;
  let leftMins = duration;
  while (leftMins >= 60) {
    durationInHrs += 1;
    leftMins -= 60;
  }
  minutes + leftMins >= 60
    ? (durationInHrs += 1 + (minutes + leftMins - 60) * 0.01)
    : (durationInHrs += (minutes + leftMins) * 0.01);
  return (
    (hour >= daylight[month][1] && hour < daylight[month][0]) ||
    hour + durationInHrs >= daylight[month][1]
  );
};

const formatTime = (time: number): string => {
  if (time >= 60) {
    return (
      Duration.fromObject({minutes: time}).toFormat('h:mm').replace(':00', '') +
      ' hs'
    );
  }

  return time + ' min';
};

const formatLength = (length: number): string => {
  if (length >= 1000) {
    return toString(length / 1000).replace('.', ',') + ' km';
  }

  return length + 'm';
};

const getDifficultyColor = (number: number): string => {
  if (number === 1) {
    return Colors.diffLow;
  }

  if (number === 2) {
    return Colors.diffMedium;
  }

  return Colors.diffHard; //number === 3
};

export type TrailInfoProps = {
  trailID: number;
  title: string;
  difficulty: Dificultad;
  distance: number;
  time: number;
  service?: number;
  open: boolean;
};

const TrailInfo: React.FC<TrailInfoProps> = ({
  trailID,
  title,
  difficulty,
  distance,
  time,
  service,
  open,
}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const senderosFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'senderos'),
  );

  const dispatch = useDispatch();

  const getLateSignal = () => {
    return (
      <View style={styles.signalContainer}>
        <View>
          <Icon name="circle" size={30} color={Colors.lateSignal} solid />
          <Icon
            style={{position: 'absolute'}}
            name="clock"
            size={30}
            color={Colors.white}
          />
        </View>
        <Text style={styles.text}>{I18n.t('tarde', {locale: idioma})}</Text>
      </View>
    );
  };

  const getClosedSignal = () => {
    return (
      <View style={styles.signalContainer}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="circle" size={30} color={Colors.closedSignal} solid />
          <Icon
            style={{position: 'absolute'}}
            name="circle"
            size={30}
            color={Colors.white}
          />
          <Icon
            style={{position: 'absolute'}}
            name="exclamation"
            size={17}
            color={Colors.white}
          />
        </View>
        <Text style={styles.text}>{I18n.t('cerrado', {locale: idioma})}</Text>
      </View>
    );
  };

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'senderos',
        id: trailID,
      }),
    );
  };

  const getSignal = (): JSX.Element | null => {
    if (!open) {
      return getClosedSignal();
    }

    if (isLate(time)) {
      return getLateSignal();
    }

    return null;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContent}>
        <View style={{alignSelf: 'flex-end'}}>
          <Text textBreakStrategy="simple" style={styles.title}>
            {title}
          </Text>
          <View
            style={[
              styles.difficulty,
              {backgroundColor: getDifficultyColor(difficulty.id)},
            ]}>
            <Text style={styles.difficultyText}>
              {difficulty.nombre.toUpperCase()}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.rowItem}>
              <Icon name="clock" size={16} style={styles.icon} />
              <Text style={styles.text}>{formatTime(time)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Icon name="route" size={16} style={styles.icon} />
              <Text style={styles.text}>{formatLength(distance)}</Text>
            </View>
            {/* <View style={{alignItems:"center", flexDirection:"row", marginRight:25}}>
            <Icon name="campground" size={16} style={styles.icon}/>
            <Text style={styles.text}>camping</Text>
          </View> */}
          </View>
        </View>
        <View style={styles.columnContent}>
          {getSignal()}
          <Pressable onPress={onFavPress} style={{marginTop: 20}}>
            <Icon
              name="heart"
              size={30}
              color={Colors.white}
              solid={senderosFav.includes(trailID)}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TrailInfo;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  difficulty: {
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  signalContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  columnContent: {
    width: 65,
    bottom: 20,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: Colors.white,
  },
  icon: {
    color: Colors.white,
    marginRight: 10,
  },
});
