import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import BackgroundAnimation from "./components/app/BackgroundAnimation";
import BackgroundGrid from "./components/app/BackgroundGrid";

import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-[#0A0A0B]">
      <BackgroundAnimation />
      <BackgroundGrid />

      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
