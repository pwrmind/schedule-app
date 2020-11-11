import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.scss';
import { routes } from './router/routes';
import RoutesWithSubroutes from './router/RoutesWithSubroutes';
import { persistentState } from './store/store';
import { setInitialState as setInitialStateParams } from './components/params.slice';
import { setInitialState as setInitialStateSchedule } from './components/Schedule/schedule.slice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setInitialStateParams(persistentState.params));
    dispatch(setInitialStateSchedule(persistentState.schedule));
  }, []);
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
