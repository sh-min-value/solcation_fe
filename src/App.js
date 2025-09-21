import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import BannerAlarm from './features/alarm/BannerAlarm';
import { SSEProvider } from './context/SSEContext';
import SSEConnector from './features/alarm/SSEConnector';
import categoryCache from './utils/CategoryCache';
import { useState, useEffect } from 'react';

export default function App() {
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('앱 초기화 시작...');

        // 카테고리 캐시 초기화
        await categoryCache.loadAllCategories();
        setCategoriesLoaded(true);
        console.log('카테고리 캐시 초기화 완료');

        setAppReady(true);
      } catch (error) {
        console.error('앱 초기화 실패:', error);
        // 실패해도 앱은 로드되도록 처리
        setAppReady(true);
        setCategoriesLoaded(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <SSEProvider>
      <AuthProvider>
        <SSEConnector />
        <BannerAlarm />
        <AppRoutes />
      </AuthProvider>
    </SSEProvider>
  );
}
