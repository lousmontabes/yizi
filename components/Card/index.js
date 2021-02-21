import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import ItemForm from '../ItemForm';
import storage from '../../utils/storage';

// TODO: Move this to constants
const colors = {
  green: 'rgba(116, 198, 157, 1)',
  black: 'rgba(0, 0, 0, 1)',
  red: 'rgba(217, 119, 119, 1)',
};

const EditView = (props) => {
  const { title, subtitle, onDelete, onFinishEditing } = props;

  const [newTitle, setNewTitle] = useState(title);
  const [newSubtitle, setNewSubtitle] = useState(subtitle);

  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  const showDeleteAlert = () => {
    Alert.alert(
      `${title} - ${subtitle}`,
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            storage.deleteItem({ title, subtitle });
            onDelete();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onSubmit = () => {
    storage.modifyItem(
      { title, subtitle },
      { title: newTitle, subtitle: newSubtitle }
    );
    onFinishEditing();
  };

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <Animated.View style={{ ...styles.button, opacity: fadeInAnim }}>
        <AnimatedIcon
          size={28}
          reverse
          color="transparent"
          reverseColor={colors.red}
          type="feather"
          name="trash-2"
          onPress={() => {
            Haptics.selectionAsync();
            showDeleteAlert();
          }}
        />
      </Animated.View>
      <ItemForm
        title={newTitle}
        subtitle={newSubtitle}
        onChangeTitle={setNewTitle}
        onChangeSubtitle={setNewSubtitle}
        onSubmit={onSubmit}
      />
    </>
  );
};

const Card = (props) => {
  const {
    title,
    subtitle,
    color,
    revealed,
    editMode,
    onDelete,
    onFinishEditing,
  } = props;
  const revealAnim = useRef(new Animated.Value(0)).current;

  const revealScale = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

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
  }, [revealed, editMode]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {editMode && (
          <EditView
            title={title}
            subtitle={subtitle}
            onDelete={onDelete}
            revealed={revealed}
            onFinishEditing={onFinishEditing}
          />
        )}
        {!editMode && (
          <>
            <Animated.Text style={titleStyle}>{title}</Animated.Text>
            <Animated.View
              style={{
                opacity: revealAnim,
                transform: [{ scale: revealScale }],
              }}
            >
              <Animated.Text style={descriptionStyle}>{subtitle}</Animated.Text>
            </Animated.View>
          </>
        )}
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
  button: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Card;
