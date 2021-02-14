import React from "react";
import { Animated, SafeAreaView, View, StyleSheet, Text } from "react-native";

const Card = (props) => {
  const { title, subtitle, color } = props;

  // TODO: Move this to constants
  const colors = {
    green: "rgba(116, 198, 157, 1)",
    black: "rgba(0, 0, 0, 1)",
    red: "rgba(217, 119, 119, 1)",
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.Text style={titleStyle}>{title}</Animated.Text>
        <Animated.Text style={descriptionStyle}>{subtitle}</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    fontFamily: "Menlo",
  },
  card: {
    backgroundColor: "#FFF",
    marginVertical: 8,
    marginHorizontal: 16,
    height: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 24,
    borderRadius: 5,
    borderColor: "#DDD",
    borderWidth: 1,
    justifyContent: "center",
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 42,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  description: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Avenir",
  },
});

export default Card;
