import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { AvailableResource, ScheduleItem, ScheduleColumn, Appointment, Client, IntervalEmployeeTask } from './schedule.models';
import { mapListResourceDtoListToDomainList } from './schedule.module';
import PatientsMock from '../../mocks/patients.json';
import ResourcesMock from '../../mocks/resources.json';
import AppointmentsMock from '../../mocks/appointments.json';
import IntervalEmployeeTaskMock from '../../mocks/IntervalEmployeeTask.json'
import { BACKUP_NAME_LOCAL_STORAGE } from '../../constants';


interface ModuleState {
    clients: Client[];
    resources: AvailableResource[];
    scheduleItems: ScheduleItem[];
    scheduleColumns: ScheduleColumn[];
    appointments: Appointment[];
    intervalEmployeeTasks: IntervalEmployeeTask[];
    selectedResources: AvailableResource[];
}

const persistanceState = JSON.parse(localStorage.getItem(BACKUP_NAME_LOCAL_STORAGE) || '{}')?.schedule;

const initialState: ModuleState =  {
    clients: persistanceState?.clients || [...PatientsMock],
    resources: persistanceState?.resources || [...mapListResourceDtoListToDomainList(ResourcesMock)],
    appointments: persistanceState?.appointments || [...AppointmentsMock],
    scheduleItems: persistanceState?.scheduleItems || [],
    scheduleColumns: persistanceState?.scheduleColumns || [],
    intervalEmployeeTasks: persistanceState?.intervalEmployeeTasks || [...IntervalEmployeeTaskMock],
    selectedResources: [],
};

const schedule = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setScheduleColumns(state: ModuleState, action: PayloadAction<ScheduleColumn[]>) {
            state.scheduleColumns = [...action.payload];
        },
        addAppointment(state: ModuleState, action: PayloadAction<Appointment>) {
            state.appointments.push(action.payload);
            state.appointments = [...state.appointments];
        },
        replaceAppointment(state: ModuleState, action: PayloadAction<Appointment>) {
            const index = state.appointments.findIndex((v) => {
                return v.clientId === action.payload.clientId &&
                    v.resourceId === action.payload.resourceId &&
                    moment(action.payload.startTime).diff(moment(v.startTime), 'minute') === 0 &&
                    moment(action.payload.endTime).diff(moment(v.endTime), 'minute') === 0;
            });
            if (index > -1) {
                console.log(`REmove appointment ${index}`);
                state.appointments.splice(index, 1);
            }
        },
        setSelectedResources(state: ModuleState, action: PayloadAction<AvailableResource[]>) {
            state.selectedResources = action.payload;
        },
    }
});

export const { setScheduleColumns, addAppointment, replaceAppointment, setSelectedResources } = schedule.actions;

export default schedule.reducer;