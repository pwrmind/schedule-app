import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../constants';


interface ModuleState {
    startDate: string;
    endDate: string;
}

const initialState: ModuleState =  {
    startDate: moment().add(0, 'day').format(DEFAULT_DATE_FORMAT),
    endDate: moment().add(1, 'week').format(DEFAULT_DATE_FORMAT),
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
        }
    }
});

export const { setStartDate, setEndDate } = params.actions;

export default params.reducer;