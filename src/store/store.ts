import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import schedule from '../components/Schedule/schedule.slice';

const rootReducer = combineReducers({schedule});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
    reducer: rootReducer,
    devTools: true,
});