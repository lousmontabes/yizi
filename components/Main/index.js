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
import theme from '../../constants/themes';

const deviceWidth = Dimensions.get('window').width;

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

  return (
    <>
      <Header
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        placement="center"
        centerComponent={{ text: 'yizi', style: styles.logo }}
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
      <StatusBar barStyle="default" />
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
            onPress={() => {
              Haptics.impactAsync();
              button2.onPress();
            }}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.background,
    justifyContent: 'space-around',
    borderBottomWidth: 0,
    paddingVertical: 20,
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
    marginTop: 20,
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
