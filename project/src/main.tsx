import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'components-funtech-ui/styles.css';
import './index.css';
import { App } from './App.tsx';
import { store } from './store';
import './styles/global-ui-scale.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
