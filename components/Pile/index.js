import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

import Card from '../Card';
import { confirmDistance } from '../../constants';
import theme from '../../constants/themes';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const dismissTarget = SCREEN_HEIGHT + 100;

const Pile = (props) => {
  const { cards } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => restart(), [cards]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const y = pan.y._value;
      const d = Math.abs(y);

      if (d < confirmDistance) {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      } else {
        dismissCard(y < 0);
      }
    },
  });

  const cardRotation = pan.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = pan.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = pan.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const nextCardTranslateY = pan.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
    outputRange: [0, 35, 0],
    extrapolate: 'clamp',
  });

  const dismissCard = (up = false) => {
    Animated.spring(pan, {
      toValue: { x: 0, y: up ? -dismissTarget : dismissTarget },
      useNativeDriver: true,
    }).start(() => {
      showNextCard();
    });
  };

  const showNextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    pan.setValue({ x: 0, y: 0 });
  };

  const getTransformStyles = () => {
    return [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotate: cardRotation },
    ];
  };

  const getCardStyle = (i) => {
    switch (i) {
      case currentIndex:
        return { transform: getTransformStyles() };
      case currentIndex + 1:
        return {
          transform: [
            { scale: nextCardScale },
            { translateY: nextCardTranslateY },
          ],
          opacity: nextCardOpacity,
        };
    }
  };

  const renderCards = () => {
    return cards
      .map((card, i) => {
        if (i < currentIndex || i > currentIndex + 1) return;
        return (
          <Animated.View style={getCardStyle(i)} key={i}>
            <Card title={card.title} subtitle={card.subtitle}></Card>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers}>{renderCards()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    marginVertical: 0,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  cardWrapper: {
    position: 'absolute',
  },
});

export default Pile;
