import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from 'antd/lib/form/interface';
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
        },
        setInitialState(state: ModuleState, action: PayloadAction<Store>) {
            if (!!action.payload) {
                Object.keys(action.payload).forEach((key) => {
                    (state as Store)[key] = action.payload[key]
                });
            }
        },
    }
});

export const { setStartDate, setEndDate, setInitialState } = params.actions;

export default params.reducer;