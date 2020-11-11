import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import schedule from '../components/Schedule/schedule.slice';
import params from '../components/params.slice';
import { BACKUP_NAME_LOCAL_STORAGE } from "../constants";

const rootReducer = combineReducers({schedule, params});

const store = configureStore({
    reducer: rootReducer,
    devTools: true
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem(BACKUP_NAME_LOCAL_STORAGE, JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;