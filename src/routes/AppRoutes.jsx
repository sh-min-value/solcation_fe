import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Main = lazy(() => import("../features/main/Main"));
const Alarm = lazy(() => import("../features/alarm/Alarm"));
const Group = lazy(() => import("../features/group/Group"));
const Account = lazy(() => import("../features/account/Account"));
const Travel = lazy(() => import("../features/travel/Travel"));
const Stat = lazy(() => import("../features/stat/Stat"));
const LoginForm = lazy(() => import("../components/auth/LoginForm"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* 보호된 라우트 */}
        <Route path="/" element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        } />
        <Route path="/alarm" element={
          <ProtectedRoute>
            <Alarm />
          </ProtectedRoute>
        } />
        <Route path="/group/:groupid" element={
          <ProtectedRoute>
            <RootLayout><Group /></RootLayout>
          </ProtectedRoute>
        }>
          <Route path="account" element={<Account />} />
          <Route path="travel" element={<Travel />} />
          <Route path="stat" element={<Stat />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
