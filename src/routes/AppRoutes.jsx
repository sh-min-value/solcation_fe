import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ErrorPage from "../components/common/ErrorPage";

const LoginForm = lazy(() => import("../components/auth/LoginForm"));
const Main = lazy(() => import("../features/main/Main"));
const Alarm = lazy(() => import("../features/alarm/Alarm"));

const Group = lazy(() => import("../features/group/Group"));
const GroupList = lazy(() => import("../features/group/GroupList"));
const Account = lazy(() => import("../features/account/Account"));
const Stat = lazy(() => import("../features/stat/Stat"));

const Travel = lazy(() => import("../features/travel/Travel"));
const PlanDetail = lazy(() => import("../features/travel/PlanDetail"));
const PlanDetailEdit = lazy(() => import("../features/travel/PlanDetailEdit"));
const TravelCreate = lazy(() => import("../features/travel/TravelCreate"));


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
            <RootLayout  title="알림">
            <Alarm />
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/group" element={
          <ProtectedRoute>
            <GroupList />
          </ProtectedRoute>
        }></Route>
        <Route path="/group/:groupid" element={
          <ProtectedRoute>
            <RootLayout><Group /></RootLayout>
          </ProtectedRoute>
        }>
          <Route path="account" element={<Account />} />
          <Route path="travel" element={<Travel />} />
          <Route path="travel/:travelid" element={<PlanDetail />} />
          <Route path="travel/:travelid/edit" element={<PlanDetailEdit />} />
          <Route path="travel/new" element={<TravelCreate />} />
          <Route path="stat" element={<Stat />} />
        </Route>
        
        {/* 에러 페이지 라우트 */}
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}
