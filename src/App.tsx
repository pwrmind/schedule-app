import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.scss';
import { routes } from './router/routes';
import RoutesWithSubroutes from './router/RoutesWithSubroutes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {routes.map((route, i) => <RoutesWithSubroutes key={i} route={route} />)}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
