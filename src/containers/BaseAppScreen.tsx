import React from 'react';
import {StatusBarProps, View} from 'react-native';
import FocusAwareStatusBar from '@/components/ui/FocusAwareStatusBar';
import {Colors} from '@/theme';
import AppHeader from '@/components/ui/AppHeader';
import {AppHeaderPropTypes} from '@/components/ui/AppHeader/AppHeader';

export type BaseAppScreenProps = {
  title: string;
  home?: boolean;
  statusBarProps?: StatusBarProps;
  headerProps?: AppHeaderPropTypes;
  children?: React.ReactNode;
};

const BaseAppScreen: React.FC<BaseAppScreenProps> = ({
  title,
  children,
  home,
  statusBarProps,
  headerProps,
}) => {
  return (
    <View style={{flex: 1}}>
      <FocusAwareStatusBar
        backgroundColor={Colors.primary}
        barStyle={'light-content'}
        {...statusBarProps}
      />
      <AppHeader home={home} title={title} {...headerProps} />
      {children}
    </View>
  );
};

export default BaseAppScreen;
