import React, {createContext, useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LoginData,
  LoginResponse,
  Usuario,
  RegisterData,
} from '../interfaces/appInterfaces';
import {authReducer, AuthState} from './authReducer';
import cafeApi from '../api/cafeApi';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (registerData: RegisterData) => void;
  signIn: (loginData: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    // No token, no autenticado
    if (!token) {
      return dispatch({type: 'notAuthenticated'});
    }

    // Hay token
    // NOTA: Habría que mandar configuración del header, pero no hace falta porque se ha hecho un middleware axios
    // en cafeApi.tsx
    const resp = await cafeApi.get('/auth');
    if (resp.status !== 200) {
      return dispatch({type: 'notAuthenticated'});
    }

    // El token es uno nuevo con una nueva vigencia
    await AsyncStorage.setItem('token', resp.data.token);

    dispatch({
      type: 'signUp',
      payload: {
        token: resp.data.token,
        user: resp.data.usuario,
      },
    });
  };

  const signUp = async ({correo, password, nombre}: RegisterData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      // console.log(error.response.data);
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Revise la información',
      });
    }
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Información incorrecta',
      });
    }
  };
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  const removeError = () => {
    dispatch({
      type: 'removeError',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
