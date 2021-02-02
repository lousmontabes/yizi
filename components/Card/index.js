import React from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";

const Card = (props) => {
  const { title, description } = props;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
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
