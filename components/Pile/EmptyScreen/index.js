import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const EmptyScreen = () => {
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

const styles = StyleSheet.create({
  emptyMessageText: {
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: '500',
  },
});

export default EmptyScreen;
