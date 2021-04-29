import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

const Card = (props) => {
  const { title, subtitle } = props;

  const [revealed, setRevealed] = useState(false);

  const revealAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (revealed) {
      Animated.spring(revealAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 20,
        speed: 100,
      }).start();
    } else {
      revealAnim.setValue(0);
    }
  }, [revealed]);

  const animateCardPressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const animateCardPressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 100,
    }).start();
  };

  const pressResponse = {
    scale: pressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.98],
    }),
    translateY: pressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 5],
    }),
  };

  const reveal = () => {
    Haptics.selectionAsync();
    setRevealed(!revealed);
  };

  return (
    <Pressable
      onPressIn={animateCardPressIn}
      onPressOut={animateCardPressOut}
      onPress={reveal}
      style={styles.wrapper}
    >
      <Animated.View
        style={[styles.card, { transform: [{ scale: pressResponse.scale }] }]}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View
          style={{
            opacity: revealAnim,
          }}
        >
          <Text style={styles.description}>{subtitle}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    fontFamily: 'Menlo',
  },
  card: {
    backgroundColor: '#FFF',
    height: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 24,
    borderRadius: 5,
    borderColor: '#EEE',
    borderWidth: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 42,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  description: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Avenir',
  },
});

export default Card;
