import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Easing,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Header } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import theme, { ink, blossom, charcoal } from '../../constants/themes';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ThemePreview = (props) => {
  const { previewedTheme, selected, onPress } = props;

  const pressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 1],
    extrapolate: 'clamp',
  });

  const animatePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      speed: 500,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.themePreviewWrapper,
          {
            shadowColor: previewedTheme.accent,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[previewedTheme.background, previewedTheme.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1.5 }}
          style={[
            styles.themePreviewGradient,
            {
              borderColor: selected ? theme.accent : 'transparent',
            },
          ]}
        ></LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const SettingsView = (props) => {
  const [selectedTheme, setSelectedTheme] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const { setButton1, setButton2 } = props;
    setButton1({
      show: true,
      icon: 'x',
      onPress: () => hideView(),
    });
    setButton2({
      show: false,
      icon: 'x',
      onPress: () => {},
    });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  const hideView = () => {
    const { hide, onHideOthers } = props;
    onHideOthers();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => hide());
  };

  const themes = [ink, charcoal, blossom];

  const renderThemeOption = ({ item, index }) => (
    <ThemePreview
      previewedTheme={item}
      selected={index == selectedTheme}
      onPress={() => {
        Haptics.impactAsync();
        setSelectedTheme(index);
      }}
    />
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <SafeAreaView style={styles.panel}>
        <Header
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          placement="left"
          centerComponent={{ text: 'Settings', style: styles.headerContent }}
          containerStyle={styles.header}
        />
        <View style={styles.inner}>
          <Text style={styles.categoryHeader}>Theme</Text>
          <FlatList
            data={themes}
            numColumns={2}
            renderItem={renderThemeOption}
            keyExtractor={(item, index) => `${index}-${item.title}`}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-around',
    borderBottomWidth: 0,
    paddingVertical: 20,
    backgroundColor: theme.cards,
  },
  headerContent: {
    fontFamily: 'Avenir',
    fontSize: 28,
    fontWeight: '700',
    color: theme.cardText,
    paddingTop: 18,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 0,
    marginHorizontal: 8,
  },
  container: {
    height: SCREEN_HEIGHT,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 34,
  },
  panel: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    zIndex: 100,
    backgroundColor: theme.cards,
  },
  inner: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 33,
    paddingVertical: 20,
  },
  categoryHeader: {
    fontSize: 24,
    fontFamily: 'Avenir',
    paddingHorizontal: 33,
    color: theme.text,
  },
  themePreviewWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: 155,
    height: 90,
    alignItems: 'center',
    marginRight: 14,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  themePreviewGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 3,
    borderRadius: 8,
  },
});

export default SettingsView;
