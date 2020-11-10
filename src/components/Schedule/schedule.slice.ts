import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from 'antd/lib/form/interface';
import { AvailableResource, ScheduleItem, ScheduleColumn } from './schedule.models';
import { mapListResourceDtoListToDomainList } from './schedule.module';
import PatientsMock from '../../mocks/patients.json';
import ResourcesMock from '../../mocks/resources.json';


interface ModuleState {
    patients: Store[];
    resources: AvailableResource[];
    scheduleItems: ScheduleItem[];
    scheduleColumns: ScheduleColumn[];
}

const initialState: ModuleState =  {
    patients: [...PatientsMock],
    resources: [...mapListResourceDtoListToDomainList(ResourcesMock)],
    scheduleItems: [],
    scheduleColumns: [],
};

const schedule = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setScheduleColumns(state: ModuleState, action: PayloadAction<ScheduleColumn[]>) {
            state.scheduleColumns = [...action.payload];
        }
    }
});

export const { setScheduleColumns } = schedule.actions;

export default schedule.reducer;