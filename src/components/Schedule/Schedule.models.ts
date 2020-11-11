import { Store } from "antd/lib/form/interface";

export enum TimeIntervalType {
    RESERVED = 'RESERVED',
    WORKING_WITH_DOCUMENTS = 'WORKING_WITH_DOCUMENTS',
    NO_APPOINTMENT = 'NO_APPOINTMENT',
    TRAINING = 'TRAINING',
    UNAVAILABLE_FOR_APPOINTMENT = 'UNAVAILABLE_FOR_APPOINTMENT',
    AVAILABLE_FOR_APPOINTMENT = 'AVAILABLE_FOR_APPOINTMENT'
}

export interface ScheduleProps {
    data: Store[];
    fromDate: Date;
    toDate: Date;
}

export interface AvailableResourceDto {
    id: number;
    fullName: string;
    office: string;
    building: string;
    specialty: string;
    startWorkingHour: string;
    endWorkingHour: string;
    workingHourStep: number;
    intervalFrom: string;
    intervalTill: string;
    workingDays: number[];
}

export interface AvailableResource {
    id: number;
    fullName: string;
    office: string;
    building: string;
    specialty: string;
    startWorkingHour: string;
    endWorkingHour: string;
    workingHourStep: number;
    intervalFrom: string;
    intervalTill: string;
    workingDays: number[];
}

export interface ScheduleColumn {
    key?: string;
    date: string;
    office: string;
    building: string;
    employee: string;
    specialty: string;
    resourceId: number;
    items: ScheduleItem[];
}

export interface ScheduleItem {
    startDate: Date;
    endDate: Date;
    office: string;
    building: string;
    employee: string;
    specialty: string;
    type: TimeIntervalType;
}

export interface ScheduleItemDto {
    startDate: string;
    endDate: string;
    office: string;
    building: string;
    employee: string;
    specialty: string;
    type: string;
}

export interface Appointment {
    date: string;
    startTime: string;
    endTime: string;
    resourceId: number;
    type: string;
}

export interface AppointmentDto {
    date: string;
    startTime: string;
    endTime: string;
    resourceId: number;
    type: string;
}

export interface ScheduleCell {
    appointment?: Appointment;
    startTime: string;
    endTime: string;
    size: number;
    type: TimeIntervalType;
}