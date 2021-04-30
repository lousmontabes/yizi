import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import Pile from '../../components/Pile';
import CreateView from '../../components/CreateView';
import ItemsListView from '../../components/ItemsListView';
import Settings from '../SettingsView';
import theme from '../../constants/themes';

const deviceWidth = Dimensions.get('window').width;

const RightHeaderButton = (props) => {
  return (
    <Icon
      size={32}
      type="feather"
      name="settings"
      color={theme.logo}
      containerStyle={{ opacity: 1 }}
      onPress={props.onPress}
    />
  );
};

const EmptyState = () => {
  return (
    <>
      <View
        style={{
          height: 500,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={32} type="feather" name="book-open" />
        <Text style={styles.emptyMessageText}>
          You don't have any yizis yet
        </Text>
        <Text style={styles.emptyMessageSubtitle}>
          Tap the button to add your first yizi
        </Text>
      </View>
    </>
  );
};

const Main = (props) => {
  const { cards, refresh } = props;

  const [createViewVisible, setCreateViewVisible] = useState(false);
  const [listViewVisible, setListViewVisible] = useState(false);
  const [settingsViewVisible, setSettingsViewVisible] = useState(false);

  const [button1, setButton1] = useState({
    show: true,
    icon: 'list',
    onPress: () => showListView(),
  });
  const [button2, setButton2] = useState({
    show: true,
    reverse: true,
    icon: 'edit-2',
    onPress: () => showCreateView(),
  });

  const onRefreshPressed = () => {
    Haptics.impactAsync();
    refresh();
  };

  const onHideOthers = () => {
    setButton1({
      show: true,
      icon: 'list',
      onPress: () => showListView(),
    });
    setButton2({
      show: true,
      reverse: true,
      icon: 'edit-2',
      onPress: () => showCreateView(),
    });
  };

  const showCreateView = () => {
    Haptics.impactAsync();
    setCreateViewVisible(true);
  };

  const hideCreateView = (createdNew) => {
    createdNew && refresh();
    setCreateViewVisible(false);
  };

  const showListView = () => {
    Haptics.impactAsync();
    setListViewVisible(true);
  };

  const hideListView = () => {
    setListViewVisible(false);
  };

  const showSettingsView = () => {
    Haptics.impactAsync();
    setSettingsViewVisible(true);
  };

  const hideSettingsView = () => {
    setSettingsViewVisible(false);
  };

  return (
    <View style={styles.appContainer}>
      <Header
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        placement="center"
        centerComponent={{ text: 'yizi', style: styles.logo }}
        rightComponent={<RightHeaderButton onPress={showSettingsView} />}
        containerStyle={styles.header}
      />
      {!!cards.length && <Pile cards={cards}></Pile>}
      {!cards.length && <EmptyState></EmptyState>}
      {createViewVisible && (
        <CreateView
          hide={hideCreateView}
          setButton1={setButton1}
          setButton2={setButton2}
          onHideOthers={onHideOthers}
        ></CreateView>
      )}
      {listViewVisible && (
        <ItemsListView
          cards={cards}
          hide={hideListView}
          setButton1={setButton1}
          setButton2={setButton2}
          onHideOthers={onHideOthers}
        />
      )}
      {settingsViewVisible && (
        <Settings
          hide={hideSettingsView}
          setButton1={setButton1}
          setButton2={setButton2}
          onHideOthers={onHideOthers}
        />
      )}
      <StatusBar
        backgroundColor={theme.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.icons}
      >
        {button1.show && (
          <Icon
            size={28}
            reverse
            color="transparent"
            reverseColor={theme.accent}
            type="feather"
            name={button1.icon}
            onPress={() => {
              Haptics.impactAsync();
              button1.onPress();
            }}
          />
        )}
        {button2.show && (
          <Icon
            reverse={button2.reverse}
            raised
            size={28}
            type="feather"
            name={button2.icon}
            color={theme.accent}
            reverseColor={theme.background}
            onPress={() => {
              Haptics.impactAsync();
              button2.onPress();
            }}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.background,
    justifyContent: 'space-around',
    borderBottomWidth: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  logo: {
    fontFamily: 'American Typewriter',
    fontSize: 28,
    fontWeight: '500',
    color: theme.logo,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 0,
  },
  item: { flex: 2 },
  controls: { flex: 1 },
  emptyMessage: {},
  komo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  emptyMessageText: {
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: '500',
  },
  icons: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    zIndex: 10000,
    marginBottom: 50,
  },
  panel: { width: deviceWidth },
});

export default Main;
