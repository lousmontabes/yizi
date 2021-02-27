import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import { confirmDistance } from '../../constants';
import storage from '../../utils/storage';

import ItemForm from '../ItemForm';

const CreateView = (props) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;
  const nextAnim = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event([null, { dy: pan }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const d = pan._value;
      if (d < confirmDistance) {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: 0, useNativeDriver: true }
        ).start();
      } else {
        hideView(true);
      }
    },
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);

  const hideView = (itemAdded) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(pan, {
        toValue: 1000,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.hide(itemAdded);
    });
  };

  const submitItem = () => {
    storage.addItem({
      title: sanitizeInput(title),
      subtitle: sanitizeInput(subtitle),
    });
    showNextInput();
    Haptics.impactAsync();
  };

  const showNextInput = () => {
    Animated.timing(nextAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      resetInputs();
      //titleInputRef.current.focus();
      nextAnim.setValue(1);
      nextOpacity.setValue(0);
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const sanitizeInput = (input) => {
    return input.trim().replace('\n', '');
  };

  const resetInputs = () => {
    setTitle('');
    setSubtitle('');
  };

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View
          style={{
            ...styles.inner,
            transform: [{ translateY: Animated.divide(pan, 3) }],
          }}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={{
              transform: [{ scale: nextAnim }],
              opacity: nextOpacity,
            }}
          >
            <ItemForm
              onSubmit={submitItem}
              onChangeTitle={(value) => setTitle(value)}
              onChangeSubtitle={(value) => setSubtitle(value)}
              title={title}
              subtitle={subtitle}
            />
          </Animated.View>
          <View style={styles.icons}>
            <Icon
              containerStyle={styles.newButton}
              size={28}
              reverse
              color="white"
              reverseColor="black"
              type="feather"
              name="x"
              onPress={() => {
                Haptics.impactAsync();
                hideView(true);
              }}
            />
            <Icon
              containerStyle={styles.newButton}
              reverse
              raised
              size={28}
              type="feather"
              name="check"
              onPress={() => {
                submitItem();
              }}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 34,
    backgroundColor: '#FFF',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  inner: {
    height: 500,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    flex: 1,
    justifyContent: 'center',
    zIndex: 34,
  },
  newButton: {},
  icons: { position: 'absolute', right: 10, bottom: 10 },
});

export default CreateView;
