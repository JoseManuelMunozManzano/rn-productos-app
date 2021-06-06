import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route, navigation}: Props) => {
  const {id = '', name = ''} = route.params;

  const {categories, isLoading} = useCategories();
  const {loadProductById} = useContext(ProductsContext);

  const {_id, categoriaId, nombre, img, form, onChange, setFormValue} = useForm(
    {
      _id: id,
      categoriaId: '',
      nombre: name,
      img: '',
    },
  );

  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    navigation.setOptions({
      title: name || 'Nuevo producto',
    });
  }, []);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    // un nuevo producto
    if (id.length === 0) {
      return;
    }

    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        {/* Picker / Selector */}
        <Text style={styles.label}>Categoría:</Text>

        {isLoading && (
          <ActivityIndicator
            style={{flex: 1, alignItems: 'center', alignContent: 'center'}}
            color="grey"
            size={30}
          />
        )}

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }>
          {categories.map(c => (
            <Picker.Item key={c._id} label={c.nombre} value={c._id} />
          ))}
        </Picker>

        <Button
          title="Guardar"
          // TODO: Por hacer
          onPress={() => {}}
          color="#5856D6"
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Button
            title="Cámara"
            // TODO: Por hacer
            onPress={() => {}}
            color="#5856D6"
          />
          <View style={{width: 10}} />
          <Button
            title="Galería"
            // TODO: Por hacer
            onPress={() => {}}
            color="#5856D6"
          />
        </View>

        <Text>{JSON.stringify(form, null, 5)}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, .2)',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
});
