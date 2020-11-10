import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import schedule from '../components/Schedule/schedule.slice';
import params from '../components/params.slice';

const rootReducer = combineReducers({schedule, params});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
    reducer: rootReducer,
    devTools: true
});