import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  PanResponder,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import Card from '../Card';
import { confirmDistance } from '../../constants';

const EmptyMessage = () => {
  return (
    <View
      style={{
        alignItems: 'center',
      }}
    >
      <Icon size={32} type="feather" name="check" />
      <Text style={styles.emptyMessageText}>You've learnt a lot!</Text>
      <Text style={styles.emptyMessageSubtitle}>
        You've gone through all your Yizis.
      </Text>
    </View>
  );
};

const Pile = (props) => {
  const { cards } = props;

  const initialState = { title: '', subtitle: '' };
  const [card, setCard] = useState(initialState);
  const [revealed, setRevealed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [empty, setEmpty] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const cardColor = useRef(new Animated.Value(0)).current;

  let prevD = 0;
  const dismissTarget = 1000;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (e, gestureState) => {
      return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1;
    },
    onPanResponderMove: (e, gestureState) => {
      const { dy } = gestureState;
      const d = Math.abs(dy);

      editMode && setEditMode(false);

      if (d > confirmDistance && prevD < confirmDistance) {
        Haptics.selectionAsync();
        Animated.timing(cardColor, {
          toValue: dy > 0 ? 100 : -100,
          duration: 100,
          useNativeDriver: false,
        }).start();
      } else if (d < confirmDistance && prevD > confirmDistance) {
        Animated.timing(cardColor, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }

      prevD = d;

      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const y = pan.y._value;
      const d = Math.abs(y);

      if (d < confirmDistance) {
        Animated.spring(
          pan,
          { toValue: { x: 0, y: 0 }, useNativeDriver: true } // Back to zero
        ).start();
      } else {
        dismissCard(y < 0);
      }
    },
  });

  const dismissCard = (up = true) => {
    Animated.timing(pan, {
      toValue: { x: 0, y: up ? -dismissTarget : dismissTarget },
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      showNextCard();
    });
  };

  const target = confirmDistance * 1;
  const nextCardTranslateY = pan.y.interpolate({
    inputRange: [-target - 1, -target, 0, target, target + 1],
    outputRange: [0, 0, 10, 0, 0],
  });
  const nextCardTranslateX = pan.y.interpolate({
    inputRange: [-target - 1, -target, 0, target, target + 1],
    outputRange: [0, 0, 0, 0, 0],
  });
  const nextCardRotation = pan.y.interpolate({
    inputRange: [-target - 1, -target, 0, target, target + 1],
    outputRange: [0, 0, 0.03, 0, 0],
  });
  const thirdCardOpacity = pan.y.interpolate({
    inputRange: [-target - 1, -target, 0, target, target + 1],
    outputRange: [1, 1, 0, 1, 1],
  });

  const resetCard = () => {
    pan.setValue({ x: 0, y: 0 });
    cardColor.setValue(0);
    setRevealed(false);
    setEditMode(false);
  };

  const showNextCard = () => {
    resetCard();

    if (cards.length > 0) {
      const newCard = cards.pop();
      setCard(newCard);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      setEmpty(true);
    }
  };

  animateCardPressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  animateCardPressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: true ? 0 : 22,
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

  useEffect(() => {
    setEmpty(false);
    showNextCard();
  }, [cards]);

  const nextCard = cards[cards.length - 1] || { title: '', subtitle: '' };

  return (
    <View style={styles.container}>
      <View style={{ opacity: empty ? 0 : 1 }}>
        <Animated.View
          style={{
            transform: [
              { translateX: pan.x },
              { translateY: Animated.add(pan.y, pressResponse.translateY) },
              { scale: pressResponse.scale },
            ],
            opacity: fadeAnim,
          }}
          {...panResponder.panHandlers}
        >
          <Pressable
            onPressIn={animateCardPressIn}
            onPressOut={animateCardPressOut}
            onPress={() => {
              Haptics.selectionAsync();
              if (editMode) {
                setEditMode(false);
              } else {
                setRevealed(true);
              }
            }}
            onLongPress={() => {
              animateCardPressOut();
              Haptics.selectionAsync();
              setEditMode(!editMode);
            }}
          >
            <Card
              title={card.title}
              subtitle={card.subtitle}
              color={cardColor}
              revealed={revealed}
              editMode={editMode}
              onDelete={dismissCard}
              onFinishEditing={() => setEditMode(false)}
            ></Card>
          </Pressable>
        </Animated.View>
        {cards.length > 0 && (
          <View style={styles.nextCard}>
            <Animated.View
              style={{
                transform: [
                  { translateX: nextCardTranslateX },
                  { translateY: nextCardTranslateY },
                  { rotate: nextCardRotation },
                ],
              }}
            >
              <Card
                title={nextCard.title}
                subtitle={nextCard.subtitle}
                color={new Animated.Value(0)}
                revealed={false}
              ></Card>
            </Animated.View>
          </View>
        )}
        {cards.length > 1 && (
          <View style={styles.thirdCard}>
            <Animated.View
              style={{
                transform: [
                  { translateX: 0 },
                  { translateY: 10 },
                  { rotate: 0.03 },
                ],
                opacity: thirdCardOpacity,
              }}
            >
              <Card
                title={''}
                subtitle={''}
                color={new Animated.Value(0)}
                revealed={false}
              ></Card>
            </Animated.View>
          </View>
        )}
      </View>
      <Animated.View
        style={{
          height: 500,
          alignContent: 'center',
          alignItems: 'center',
          zIndex: -1,
          justifyContent: 'center',
        }}
      >
        <EmptyMessage></EmptyMessage>
      </Animated.View>
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
  newButton: {
    position: 'absolute',
    right: 10,
    bottom: 50,
  },
  nextCard: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    zIndex: -10,
    padding: 0,
  },
  thirdCard: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    zIndex: -11,
  },
});

export default Pile;
