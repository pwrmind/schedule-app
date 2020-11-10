import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from 'antd/lib/form/interface';
import { AvailableResource, ScheduleItem, ScheduleColumn } from './schedule.models';
import { mapListScheduleItemToDomainList, mapScheduleItemsToColumn, sortScheduleItemsByDate} from './schedule.module';
import PatientsMock from '../../mocks/patients.json';
import ResourcesMock from '../../mocks/resources.json';
import ScheduleItemsMock from '../../mocks/schedule.json';


interface ModuleState {
    patients: Store[];
    resources: AvailableResource[];
    scheduleItems: ScheduleItem[];
    scheduleColumns: ScheduleColumn[];
}

const initialState: ModuleState =  {
    patients: [...PatientsMock],
    resources: [...ResourcesMock],
    scheduleItems: [...mapListScheduleItemToDomainList(ScheduleItemsMock as any[])],
    scheduleColumns: [...sortScheduleItemsByDate(mapScheduleItemsToColumn(mapListScheduleItemToDomainList(ScheduleItemsMock as any[])))],
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