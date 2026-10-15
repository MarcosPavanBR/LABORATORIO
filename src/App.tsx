import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClientApp from './pages/ClientApp';
import RestaurantApp from './pages/RestaurantApp';
import DeliveryApp from './pages/DeliveryApp';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'client':
      return <ClientApp />;
    case 'restaurant':
      return <RestaurantApp />;
    case 'delivery':
      return <DeliveryApp />;
    default:
      return <LandingPage />;
  }
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
