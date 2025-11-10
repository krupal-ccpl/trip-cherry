import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import Dashboard from './layouts/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
