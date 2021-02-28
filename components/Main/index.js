import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import Pile from '../../components/Pile';
import CreateView from '../../components/CreateView';

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
  const [createViewVisible, setCreateViewVisible] = useState(false);
  const { cards, refresh } = props;

  const onRefreshPressed = () => {
    Haptics.impactAsync();
    refresh();
  };

  const showCreateView = () => {
    Haptics.impactAsync();
    setCreateViewVisible(true);
  };

  const hideCreateView = (createdNew) => {
    createdNew && refresh();
    setCreateViewVisible(false);
  };

  return (
    <>
      <Header
        barStyle="light-content"
        placement="center"
        centerComponent={{ text: 'yizi', style: styles.logo }}
        containerStyle={{
          backgroundColor: '#FFF',
          justifyContent: 'space-around',
          borderBottomWidth: 0,
          paddingVertical: 20,
        }}
      />
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.panel}>
          <Text>Your yizis</Text>
        </View>
        <View style={styles.panel}>
          {!!cards.length && <Pile cards={cards}></Pile>}
          {!cards.length && <EmptyState></EmptyState>}
        </View>
      </ScrollView>
      <View style={styles.icons}>
        <Icon
          size={28}
          reverse
          color="transparent"
          reverseColor="black"
          type="feather"
          name="refresh-ccw"
          onPress={onRefreshPressed}
        />
        <Icon
          reverse
          raised
          size={28}
          type="feather"
          name="edit-2"
          onPress={showCreateView}
        />
      </View>
      {createViewVisible && <CreateView hide={hideCreateView}></CreateView>}
      <StatusBar barStyle="default" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    padding: 20,
    paddingLeft: 30,
    paddingTop: 50,
    width: '100%',
  },
  logo: {
    fontFamily: 'American Typewriter',
    fontSize: 28,
    fontWeight: '500',
    color: '#BBB',
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
  icons: { position: 'absolute', right: 10, bottom: 50, zIndex: 10 },
  panel: { width: deviceWidth },
});

export default Main;
