import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import Admin from './pages/Dashboard/Admin';


function App () {


  return (
<Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    // add protected routes here: //
<Route path="/dashboard" element={<ProtectedRoute><Dashboard />
</ProtectedRoute>}/>
<Route path="/admin" element={<AdminProtectedRoute>
  <Admin />
</AdminProtectedRoute>}/>

    <Route path="/" element={<Navigate to="/login" replace />} />

</Routes>
  
);

}

export default App;
