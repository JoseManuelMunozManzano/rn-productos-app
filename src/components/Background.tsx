import React from 'react';
import {Dimensions, Platform, View} from 'react-native';

const {height, width} = Dimensions.get('screen');

export const Background = () => {
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#5856D6',
        top: -height * 0.9,
        width: Platform.OS === 'android' ? width * 3 : width * 3.5,
        height: height * 2,
        transform: [
          {
            rotate: '-70deg',
          },
        ],
      }}
    />
  );
};
