import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Profile from "./pages/profile";
import ChangePassword from "./pages/ChangePassword";
import Terms from "./pages/Terms";
import PersonalInfo from "./pages/PersonalInfo";
import BankInfo from "./pages/BankInfo";
import Support from "./pages/Support";
import Loan from "./pages/Loan";
import Withdrew from "./pages/withdrew";
import TransactionHistory from "./pages/TransactionHistory";
import PaymentInfo from "./pages/PaymentInfo";

/* ================= AUTH ================= */
const getToken = () => localStorage.getItem("access");

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ================= PUBLIC ROUTE ================= */
const PublicRoute = ({ children }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ================= APP ================= */
function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ================= PROTECTED ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bank-info"
        element={
          <ProtectedRoute>
            <BankInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/personal-info"
        element={
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/loan"
        element={
          <ProtectedRoute>
            <Loan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/terms"
        element={
          <ProtectedRoute>
            <Terms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-info"
        element={
          <ProtectedRoute>
            <PaymentInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/withdrew"
        element={
          <ProtectedRoute>
            <Withdrew />
          </ProtectedRoute>
        }
      />

      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT ================= */}
      <Route
        path="*"
        element={
          <Navigate
            to={getToken() ? "/dashboard" : "/"}
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
