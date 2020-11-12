import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { BACKUP_NAME_LOCAL_STORAGE, DEFAULT_DATE_FORMAT } from '../constants';


interface ModuleState {
    startDate: string;
    endDate: string;
    patientQuery: string;
}

const persistanceState = JSON.parse(localStorage.getItem( BACKUP_NAME_LOCAL_STORAGE) || '{}')?.params;

const initialState: ModuleState =  {
    startDate: persistanceState?.startDate || moment().add(0, 'day').format(DEFAULT_DATE_FORMAT),
    endDate: persistanceState?.endDate || moment().add(1, 'week').format(DEFAULT_DATE_FORMAT),
    patientQuery: '',
};

const params = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setStartDate(state: ModuleState, action: PayloadAction<string>) {
            state.startDate = action.payload;
        },
        setEndDate(state: ModuleState, action: PayloadAction<string>) {
            state.endDate = action.payload;
        },
        setPatientQuery(state: ModuleState, action: PayloadAction<string>) {
            state.patientQuery = action.payload;
        },
    }
});

export const { setStartDate, setEndDate, setPatientQuery } = params.actions;

export default params.reducer;