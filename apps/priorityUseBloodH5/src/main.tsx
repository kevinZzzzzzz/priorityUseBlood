import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import './index.scss'
import vConsole from 'vconsole'

// 测试环境开启vconsole
if (import.meta.env.VITE_ENV === 'development') {
  new vConsole()
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
		</PersistGate>
  </Provider>
);