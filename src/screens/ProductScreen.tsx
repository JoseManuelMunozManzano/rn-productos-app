import React, {useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
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
  const {loadProductById, addProduct, updateProduct, deleteProduct} =
    useContext(ProductsContext);

  const {_id, categoriaId, nombre, img, form, onChange, setFormValue} = useForm(
    {
      _id: id,
      categoriaId: '',
      nombre: name,
      img: '',
    },
  );

  useEffect(() => {
    navigation.setOptions({
      title: nombre || 'Sin nombre de producto',
    });
  }, [nombre]);

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

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      // Esto no funcionaría la primera vez porque no ha renderizado todavía. La segunda vez que se pulsara Guardar (sin salir) si funcionaría
      // if (categoriaId.length === 0) {
      //   onChange(categories[0]._id, 'categoriaId');
      // }
      // Como no funciona el código anterior para lo que queremos, usamos esta sentencia
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const deleteHandler = async () => {
    await deleteProduct(id);
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

        {isLoading ? (
          <ActivityIndicator
            style={{flex: 1, alignItems: 'center', alignContent: 'center'}}
            color="grey"
            size={30}
          />
        ) : (
          <Picker
            selectedValue={categoriaId}
            onValueChange={value => onChange(value, 'categoriaId')}>
            {categories.map(c => (
              <Picker.Item key={c._id} label={c.nombre} value={c._id} />
            ))}
          </Picker>
        )}

        {id.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginHorizontal: 20,
            }}>
            <Button title="Guardar" onPress={saveOrUpdate} color="#5856D6" />
            <View style={{width: 10}} />
            <Button title="Eliminar" onPress={deleteHandler} color="red" />
          </View>
        ) : (
          <Button title="Guardar" onPress={saveOrUpdate} color="#5856D6" />
        )}

        {_id.length > 0 && (
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
        )}

        {img.length > 0 && (
          <Image
            source={{uri: img}}
            style={{marginTop: 20, width: '100%', height: 200}}
          />
        )}

        {/* Mostrar imagen temporal */}

        {/* <Text>{JSON.stringify(form, null, 5)}</Text> */}
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
