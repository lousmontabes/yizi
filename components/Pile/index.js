import React, { useRef, useState } from "react";
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
  const initialState = { title: "椅子 Yǐzi", description: "Chair" };
  const [card, setCard] = useState(initialState);

  const { cards } = props;

  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const emptyMessageOpacity = useRef(new Animated.Value(0)).current;

  let prevD = 0;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const { dx, dy } = gestureState;
      const d = Math.sqrt(dx * dx + dy * dy);

      d > confirmDistance && prevD < confirmDistance && Haptics.impactAsync();

      prevD = d;

      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const x = pan.x._value;
      const y = pan.y._value;
      const d = Math.sqrt(x * x + y * y);
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
          } // Back to zero
        ).start(() => {
          showNextCard();
        });
      }
    },
  });

  const showNextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    fadeAnim.setValue(0);

    if (cards.length > 0) {
      setCard(cards.pop());

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
          <Card title={card.title} description={card.description}></Card>
        </Animated.View>
      </View>
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
});

export default Pile;
