import { Store } from "antd/lib/form/interface";
import { ScheduleItem, ScheduleItemDto, TimeIntervalType, ScheduleColumn } from "./Schedule.models";
import ScheduleData from '../../mocks/schedule.json';

export function getDayTimeIntervals(interValsInHour: number, fromHour = 0, tillHourd = 24) {
    if (60%interValsInHour > 0 ) {
        throw new Error(`No valid time interval for hour`);
    }
    const intervalsCount = Math.round(24*(60/interValsInHour));
    return Array(intervalsCount).fill('')
        .map((value, index) => `${Math.floor(index * 0.5)}:${(index % 2 > 0) || (index === 1) ? '30' : '00' }`)
        .filter((value, index) => Math.floor(index * 0.5) >= fromHour && Math.floor(index * 0.5 + 0.5) <= tillHourd);
}

export function mapScheduleItemToDomain(dto: ScheduleItemDto): ScheduleItem {
    if (!(TimeIntervalType as Store)[dto.type]) {
        throw new Error(`No such type of Time interval type`);
    }
    return {...dto, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate), type: dto.type as TimeIntervalType};
}

export function mapListScheduleItemToDomainList(list: ScheduleItemDto[]): ScheduleItem[] {
    return list.map(mapScheduleItemToDomain);
}

export function mapScheduleItemsToColumn(list: ScheduleItem[]): ScheduleColumn[] {
    return [];
}

export async function fetchScheduleData(): Promise<ScheduleItemDto[]>  {
    return Promise.resolve(ScheduleData as ScheduleItemDto[]);
}