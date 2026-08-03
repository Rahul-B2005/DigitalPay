import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import ScanPay from './pages/ScanPay';
import BillPay from './pages/BillPay';
import History from './pages/History';
import Receipt from './pages/Receipt';
import Profile from './pages/Profile';
import MerchantDashboard from './pages/MerchantDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/send" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><ScanPay /></ProtectedRoute>} />
          <Route path="/bills" element={<ProtectedRoute><BillPay /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/receipt/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/merchant" element={<ProtectedRoute merchantOnly><MerchantDashboard /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
