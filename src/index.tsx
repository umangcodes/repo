import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Provider from './provider';
import StepsProvider from "./context/stepsContext"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <StepsProvider>
      <Provider>
          <App />
      </Provider>
      </StepsProvider>
  </React.StrictMode>
);