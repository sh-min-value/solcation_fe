import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// 초기 상태
const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  tokenType: localStorage.getItem('tokenType'),
  expiresIn: localStorage.getItem('expiresIn'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// 액션 타입
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// 리듀서
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        tokenType: action.payload.tokenType,
        expiresIn: action.payload.expiresIn,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        accessToken: null,
        tokenType: null,
        expiresIn: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        tokenType: null,
        expiresIn: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// 컨텍스트 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 토큰 저장
  const saveTokens = (accessToken, tokenType, expiresIn) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenType', tokenType);
    localStorage.setItem('expiresIn', expiresIn);
  };

  // 토큰 제거
  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('expiresIn');
  };

  // 로그인
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });
      
      const response = await authAPI.login(credentials);
      const { accessToken, tokenType, expiresIn, userId, userName, email, tel } = response;
      
      const user = {
        userId,
        userName,
        email,
        tel
      };
      
      saveTokens(accessToken, tokenType, expiresIn);
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user,
          accessToken,
          tokenType,
          expiresIn
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || '로그인에 실패했습니다.';
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // 로그아웃
  const logout = () => {
    clearTokens();
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  // 에러 클리어
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    if (state.accessToken) {
      // 토큰이 있으면 로그인 상태로 설정
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user: {
            userId: 'admin',
            userName: '관리자',
            email: 'admin@example.com',
            tel: '010-1234-5678'
          },
          accessToken: state.accessToken,
          tokenType: state.tokenType,
          expiresIn: state.expiresIn
        }
      });
    } else {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    }
  }, [state.accessToken, state.tokenType, state.expiresIn]);

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};