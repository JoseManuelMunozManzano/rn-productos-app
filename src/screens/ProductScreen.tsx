import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route, navigation}: Props) => {
  const {id, name = ''} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: name || 'Nuevo producto',
    });
  }, []);

  return (
    <View>
      <Text>
        {id} {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
