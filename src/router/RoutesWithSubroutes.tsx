import React from 'react';
import { Route } from 'react-router-dom';
import { CustomRoute } from './routes';

export default function RoutesWithSubroutes(props: {route: CustomRoute}) {
    const {route: {path, routes}, route} = props;
    return (
        <Route path={path} render={(props: any) => <route.component  {...props} routes={routes}/>}/>
    );
}