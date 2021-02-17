import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const Card = (props) => {
  const { title, subtitle, color, revealed } = props;
  const revealAnim = useRef(new Animated.Value(0)).current;

  const revealScale = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  // TODO: Move this to constants
  const colors = {
    green: 'rgba(116, 198, 157, 1)',
    black: 'rgba(0, 0, 0, 1)',
    red: 'rgba(217, 119, 119, 1)',
  };

  const textColor = color.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [colors.red, colors.black, colors.green],
  });

  const titleStyle = {
    ...StyleSheet.flatten(styles.title),
    color: textColor,
  };

  const descriptionStyle = {
    ...StyleSheet.flatten(styles.description),
    color: textColor,
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.Text style={titleStyle}>{title}</Animated.Text>
        <Animated.View
          style={{ opacity: revealAnim, transform: [{ scale: revealScale }] }}
        >
          <Animated.Text style={descriptionStyle}>{subtitle}</Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
