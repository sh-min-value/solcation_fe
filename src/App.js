import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import BannerAlarm from './features/alarm/BannerAlarm';
import { SSEProvider } from './context/SSEContext';
import SSEConnector from './features/alarm/SSEConnector';

export default function App() {
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
