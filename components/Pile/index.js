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

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const dismissTarget = SCREEN_HEIGHT + 100;

const Pile = (props) => {
  const { cards } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => restart(), [cards]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
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

  const cardRotation = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
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

  const renderCards = () => {
    return cards
      .map((card, i) => {
        if (i < currentIndex || i > currentIndex + 1) return;
        return (
          <Animated.View
            style={i === currentIndex && { transform: getTransformStyles() }}
            key={i}
          >
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
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardWrapper: {
    position: 'absolute',
  },
});

export default Pile;
