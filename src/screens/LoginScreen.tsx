import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/LoginTheme';
import {RootStackParams} from '../navigator/Navigator';
import {AuthContext} from '../context/AuthContext';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {signIn, errorMessage, removeError} = useContext(AuthContext);

  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    Alert.alert('Login incorrecto', errorMessage, [
      {text: 'Ok', onPress: removeError},
    ]);
  }, [errorMessage]);

  const onLogin = () => {
    Keyboard.dismiss();
    signIn({correo: email, password});
  };

  return (
    <>
      {/* Background */}
      <Background />

      <KeyboardAwareScrollView
        style={{flex: 1}}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled>
        <View
          style={[
            loginStyles.formContainer,
            Platform.OS === 'android'
              ? loginStyles.formContainerAndroid
              : loginStyles.formContainerIos,
          ]}>
          {/* Keyboard avoid view */}
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>
          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder="Ingrese su email"
            placeholderTextColor="rgba(255, 255, 255, .4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Contraseña:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor="rgba(255, 255, 255, .4)"
            underlineColorAndroid="white"
            secureTextEntry
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Boton login */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onLogin}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Crear una nueva cuenta */}
          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text style={loginStyles.buttonText}>Nueva cuenta </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
