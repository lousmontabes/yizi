import React, { useRef, useEffect } from 'react';
import { StyleSheet, TextInput, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

const ItemForm = (props) => {
  const {
    onChangeTitle,
    onChangeSubtitle,
    onSubmit,
    title,
    subtitle,
    revealed,
    editable,
  } = props;

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const titleShake = useRef(new Animated.Value(0)).current;
  const subtitleShake = useRef(new Animated.Value(0)).current;

  const startShake = (shakeAnimation) => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const titleInputRef = useRef();
  const subtitleInputRef = useRef();

  const presentInput = (input) => {
    return input.trimLeft().replace('\n', '');
  };

  const onSubmitTitle = () => {
    subtitleInputRef.current.focus();
  };

  useEffect(() => {
    editable && titleInputRef.current.focus();
  }, [editable]);

  useEffect(() => {
    if (revealed) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      fadeInAnim.setValue(0);
    }
  }, [revealed]);

  return (
    <>
      <Animated.View
        style={{
          transform: [{ translateX: titleShake }],
        }}
      >
        <TextInput
          ref={titleInputRef}
          value={title}
          maxLength={25}
          onChangeText={(text) => {
            onChangeTitle(presentInput(text));
          }}
          onSubmitEditing={onSubmitTitle}
          placeholder="New yizi"
          placeholderTextColor="#999"
          selectionColor={'#000'}
          style={styles.titleInput}
          returnKeyType="next"
          spellCheck={false}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
        />
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateX: subtitleShake }],
          opacity: fadeInAnim,
        }}
      >
        <TextInput
          ref={subtitleInputRef}
          value={subtitle}
          maxLength={50}
          multiline={true}
          onChangeText={(text) => {
            onChangeSubtitle(presentInput(text));
          }}
          onSubmitEditing={onSubmit}
          placeholder="Its deep meaning"
          placeholderTextColor="#999"
          selectionColor={'#000'}
          style={styles.subtitleInput}
          enablesReturnKeyAutomatically
          returnKeyType="done"
          scrollEnabled={false}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    textAlign: 'center',
    fontSize: 42,
    fontFamily: 'Avenir',
    fontWeight: '500',
    marginHorizontal: 15,
  },
  subtitleInput: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Avenir',
    marginHorizontal: 15,
  },
});

export default ItemForm;
