import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  View,
  PanResponder,
  Text,
  Image,
} from "react-native";
import * as Haptics from "expo-haptics";

import Card from "../Card";
import { confirmDistance } from "../../constants";

const EmptyMessage = () => {
  return (
    <View>
      <Image style={styles.komo} source={require("../../assets/komo.webp")} />
      <Text style={styles.emptyMessageText}>You've learnt a lot!</Text>
      <Text style={styles.emptyMessageSubtitle}>
        You've gone through all your Yizis.
      </Text>
    </View>
  );
};

const Pile = (props) => {
  const { cards } = props;

  const initialState = { title: "", subtitle: "" };
  const [card, setCard] = useState(initialState);

  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const emptyMessageOpacity = useRef(new Animated.Value(0)).current;
  const cardColor = useRef(new Animated.Value(0)).current;

  let prevD = 0;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const { dy } = gestureState;
      const d = Math.abs(dy);

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
      const x = pan.x._value;
      const y = pan.y._value;
      //const d = Math.sqrt(x * x + y * y);
      const d = Math.abs(y);

      if (d < confirmDistance) {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: true } // Back to zero
        ).start();
      } else {
        Animated.timing(
          pan, // Auto-multiplexed
          {
            toValue: { x: 0, y: y > 0 ? 1000 : -1000 },
            duration: 150,
            useNativeDriver: true,
          }
        ).start(() => {
          showNextCard();
        });
      }
    },
  });

  const showNextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(0);
    cardColor.setValue(0);

    if (cards.length > 0) {
      const n = cards.pop();
      setCard(n);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(emptyMessageOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    showNextCard();
  }, [cards]);

  const nextCard = cards[cards.length - 1] || { title: "", subtitle: "" };

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            opacity: fadeAnim,
          }}
          {...panResponder.panHandlers}
        >
          <Card
            title={card.title}
            subtitle={card.subtitle}
            color={cardColor}
          ></Card>
        </Animated.View>
        <View style={styles.nextCard}>
          <Card
            title={nextCard.title}
            subtitle={nextCard.subtitle}
            color={cardColor}
          ></Card>
        </View>
      </View>
      {cards.length === 0 && (
        <Animated.View
          style={{
            flex: 3,
            alignContent: "center",
            alignItems: "center",
            zIndex: 0,
            opacity: emptyMessageOpacity,
          }}
        >
          <EmptyMessage></EmptyMessage>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    padding: 20,
    paddingLeft: 30,
    paddingTop: 50,
    width: "100%",
  },
  logo: {
    fontFamily: "American Typewriter",
    fontSize: 28,
    fontWeight: "500",
    color: "#BBB",
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
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: "500",
  },
  newButton: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },
  nextCard: {
    flex: 1,
    width: "100%",
    position: "absolute",
    zIndex: -10,
    transform: [
      { rotate: (Math.random() * 2 - 1) * 0.05 },
      { translateX: Math.random() * 5 },
      { translateY: Math.random() * 10 },
    ],
  },
});

export default Pile;
