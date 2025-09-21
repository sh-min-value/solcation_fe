import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ErrorPage from '../components/common/ErrorPage';
import Loading from '../components/common/Loading';

const LoginForm = lazy(() => import('../components/auth/LoginForm'));
const Main = lazy(() => import('../features/main/Main'));
const Alarm = lazy(() => import('../features/alarm/Alarm'));

const Group = lazy(() => import('../features/group/Group'));
const GroupCreate = lazy(() => import('../features/group/GroupCreate'));
const GroupList = lazy(() => import('../features/group/GroupList'));
const Account = lazy(() => import('../features/account/Account'));
const AccountCreate = lazy(() => import('../features/account/AccountCreate'));
const Stat = lazy(() => import('../features/stat/Stat'));
const TransactionDetail = lazy(() =>
  import('../features/transaction/TransactionDetail')
);
const Card = lazy(() => import('../features/transaction/Card'));
const EmptyCard = lazy(() => import('../features/transaction/EmptyCard'));

const Travel = lazy(() => import('../features/travel/Travel'));
const PlanDetail = lazy(() => import('../features/travel/PlanDetail'));
const PlanDetailEdit = lazy(() => import('../features/travel/PlanDetailEdit'));
const PlanDetailCreate = lazy(() =>
  import('../features/travel/PlanDetailCreate')
);
const TravelCreate = lazy(() => import('../features/travel/TravelCreate'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginForm />} />

        {/* 보호된 라우트 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alarm"
          element={
            <ProtectedRoute>
              <RootLayout title="알림">
                <Alarm />
              </RootLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <GroupList />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/group/new"
          element={
            <ProtectedRoute>
              <GroupCreate />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/group/:groupid/account/new"
          element={
            <ProtectedRoute>
              <AccountCreate />
            </ProtectedRoute>
          }
        />

        {/* RootLayout 없이 독립적인 라우트들 */}
        <Route
          path="/group/:groupid/travel/:travelid"
          element={
            <ProtectedRoute>
              <PlanDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupid/travel/:travelid/edit"
          element={
            <ProtectedRoute>
              <PlanDetailEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupid/travel/:travelid/edit/new"
          element={
            <ProtectedRoute>
              <PlanDetailCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupid/travel/new"
          element={
            <ProtectedRoute>
              <TravelCreate />
            </ProtectedRoute>
          }
        />

        {/* 그룹 영역 */}
        <Route
          path="/group/:groupid"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="main" element={<Group />} />
          <Route path="account" element={<Account />} />
          <Route
            path="account/transaction/:satPk"
            element={<TransactionDetail />}
          />
          <Route path="travel" element={<Travel />} />
          <Route path="stats" element={<Stat />} />
          <Route path="stats/:travelid" element={<Stat />} />
          <Route path="account/card/:sacPk" element={<Card />} />
          <Route path="account/card/empty" element={<EmptyCard />} />
        </Route>

        {/* 에러 페이지 라우트 */}
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}
