import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment, { Moment } from 'moment';


interface ModuleState {
    dateRange: [Moment, Moment];
}

const initialState: ModuleState =  {
    dateRange: [moment().startOf('day'), moment().add(1,'week').startOf('day')],
};

const params = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setDateRange(state: ModuleState, action: PayloadAction<[Moment, Moment]>) {
            state.dateRange = [...action.payload];
        }
    }
});

export const { setDateRange } = params.actions;

export default params.reducer;