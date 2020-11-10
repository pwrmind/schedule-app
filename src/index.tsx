import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import locale from 'antd/lib/locale/ru_RU';
import { ConfigProvider } from 'antd';
import 'moment/locale/ru';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import moment from 'moment';
import './index.scss';

moment.locale('ru');

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
