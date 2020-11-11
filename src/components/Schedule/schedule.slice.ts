import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { AvailableResource, ScheduleItem, ScheduleColumn, Appointment, Client } from './schedule.models';
import { mapListResourceDtoListToDomainList } from './schedule.module';
import PatientsMock from '../../mocks/patients.json';
import ResourcesMock from '../../mocks/resources.json';
import AppointmentsMock from '../../mocks/appointments.json'


interface ModuleState {
    clients: Client[];
    resources: AvailableResource[];
    scheduleItems: ScheduleItem[];
    scheduleColumns: ScheduleColumn[];
    appointments: Appointment[]; 
}

const initialState: ModuleState =  {
    clients: [...PatientsMock],
    resources: [...mapListResourceDtoListToDomainList(ResourcesMock)],
    appointments: [...AppointmentsMock],
    scheduleItems: [],
    scheduleColumns: [],
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
    }
});

export const { setScheduleColumns, addAppointment, replaceAppointment } = schedule.actions;

export default schedule.reducer;