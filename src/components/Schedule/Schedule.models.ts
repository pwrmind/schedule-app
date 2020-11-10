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

export interface AvailableResource {
    id: number;
    fullName: string;
    office: string;
    building: string;
    specialty: string;
    startWorkingHour: string;
    endWorkingHour: string;
    workingHourStep: number;
}

export interface ScheduleColumn {
    key?: string;
    date: Date;
    office: string;
    building: string;
    employee: string;
    specialty: string;
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