// App.jsx
// Composition root: wires up global providers (Auth, Toast) and renders
// the route tree. No page-specific logic should live here.

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
