import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";

const Main = lazy(() => import("../features/main/Main"));
const Alarm = lazy(() => import("../features/alarm/Alarm"));
const Group = lazy(() => import("../features/group/Group"));
const Account = lazy(() => import("../features/account/Account"));
const Travel = lazy(() => import("../features/travel/Travel"));
const Stat = lazy(() => import("../features/stat/Stat"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/group/:groupid" element={<RootLayout><Group /></RootLayout>}>
          <Route path="account" element={<Account />} />
          <Route path="travel" element={<Travel />} />
          <Route path="stat" element={<Stat />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
