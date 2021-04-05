import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import Pile from '../../components/Pile';
import CreateView from '../../components/CreateView';
import ItemsListView from '../../components/ItemsListView';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
  const [movingPile, setMovingPile] = useState(false);
  const { cards, refresh } = props;

  const scrollView = useRef();

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

  const onStartMovingPile = () => {
    setMovingPile(true);
    //scrollView.current.scrollToEnd();
  };

  const onEndMovingPile = () => {
    setMovingPile(false);
  };

  return (
    <>
      <ScrollView
        ref={scrollView}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!movingPile}
        contentOffset={{ x: deviceWidth }}
      >
        <SafeAreaView style={styles.panel}>
          <Header
            barStyle="dark-content"
            placement="left"
            centerComponent={{ text: 'Your yizis', style: styles.logo2 }}
            containerStyle={{
              backgroundColor: '#FFF',
              justifyContent: 'space-around',
              borderBottomWidth: 0,
              paddingVertical: 20,
            }}
          />
          <ItemsListView cards={cards} />
        </SafeAreaView>
        <SafeAreaView style={styles.panel}>
          <Header
            barStyle="dark-content"
            placement="center"
            centerComponent={{ text: 'yizi', style: styles.logo }}
            containerStyle={{
              backgroundColor: '#FFF',
              justifyContent: 'space-around',
              borderBottomWidth: 0,
              paddingVertical: 20,
            }}
          />
          {!!cards.length && (
            <Pile
              cards={cards}
              onStartMove={onStartMovingPile}
              onEndMove={onEndMovingPile}
            ></Pile>
          )}
          {!cards.length && <EmptyState></EmptyState>}
        </SafeAreaView>
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
  logo2: {
    fontFamily: 'Avenir',
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 0,
    marginHorizontal: 8,
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
