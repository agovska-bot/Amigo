
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

// Паметно регистрирање на Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hostname = window.location.hostname;
    // Листа на домени каде што Service Worker НЕ треба да се регистрира (тест околини)
    const isTestEnv = 
      hostname.includes('usercontent.goog') || 
      hostname.includes('ai.studio') || 
      hostname.includes('localhost') ||
      window.location.protocol === 'file:';

    if (!isTestEnv) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('Amigo PWA: Активен');
        })
        .catch(error => {
          // Тивко запишување само ако навистина е критично
          console.debug('ServiceWorker bypass on this origin');
        });
    } else {
      console.log('Amigo: ServiceWorker е оневозможен во тест околина за да се избегне Origin Error.');
    }
  });
}
