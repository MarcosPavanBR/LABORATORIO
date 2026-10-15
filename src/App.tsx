import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import ClientApp from './pages/ClientApp';
import RestaurantApp from './pages/RestaurantApp';
import DeliveryApp from './pages/DeliveryApp';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
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
      <AppContent />
    </AppProvider>
  );
}

export default App;
