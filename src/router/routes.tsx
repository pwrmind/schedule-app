import Sheduling from '../views/Sheduling';

export interface CustomRoute {
    path: string;
    component: (route: CustomRoute) => JSX.Element;
    routes?:  CustomRoute[];
}

export const routes: CustomRoute[]  = [
    {
        path: '/',
        component: Sheduling,
    }
];