import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    }
});

export const { setScheduleColumns, addAppointment } = schedule.actions;

export default schedule.reducer;