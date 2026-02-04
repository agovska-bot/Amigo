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

// Безбедно регистрирање на Service Worker
if ('serviceWorker' in navigator) {
  // Проверка дали сме во ограничена околина (sandbox) како ai.studio или usercontent.goog
  // Service Workers честопати не се дозволени во овие прегледи и предизвикуваат грешки со доменот.
  const isRestricted = 
    window.location.hostname.includes('usercontent.goog') || 
    window.location.hostname.includes('ai.studio') ||
    window.location.protocol === 'file:';

  if (!isRestricted) {
    window.addEventListener('load', () => {
      // Користиме релативен пат ('service-worker.js') наместо апсолутен ('/service-worker.js')
      // Ова спречува грешки каде прелистувачот мисли дека фајлот е на главниот домен на Google.
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('Amigo ServiceWorker активен');
        })
        .catch(error => {
          console.debug('ServiceWorker регистрирањето не успеа (очекувано во некои околини):', error.message);
        });
    });
  } else {
    console.debug('Регистрирањето на ServiceWorker е прескокнато поради ограничена околина (sandbox).');
  }
}
