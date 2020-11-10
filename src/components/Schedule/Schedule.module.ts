import { Store } from "antd/lib/form/interface";
import { ScheduleItem, ScheduleItemDto, TimeIntervalType, ScheduleColumn, AvailableResource } from "./schedule.models";
import moment from 'moment'
import ScheduleData from '../../mocks/schedule.json';

export function getDayTimeIntervals(interValsInHour: number, fromHour = 0, tillHour = 24): string[] {
    if (60%interValsInHour > 0 ) {
        throw new Error(`No valid time interval for hour`);
    }
    const intervalsCount = Math.round(24*(60/interValsInHour));
    return Array(intervalsCount).fill('')
        .map((value, index) => `${Math.floor(index * 0.5)}:${(index % 2 > 0) || (index === 1) ? '30' : '00' }`)
        .filter((value, index) => Math.floor(index * 0.5) >= fromHour && Math.floor(index * 0.5 + 0.5) <= tillHour);
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

function getColumnGenericKey(item: ScheduleItem): string {
    const {startDate, employee, office, specialty} = item;
    return startDate.getDate() + startDate.getMonth() + startDate.getFullYear() + employee + office + specialty;
}

export function mapScheduleItemsToColumn(list: ScheduleItem[]): ScheduleColumn[] {
    const hashMap = list.reduce((acc, value) => {
        const genericKey = getColumnGenericKey(value);
        if (acc.has(genericKey) && acc.get(genericKey)) {
            acc.get(genericKey)?.push(value);
        }
        if (!acc.has(genericKey)) {
            acc.set(genericKey, [value]);
        }
        return acc;
    }, new Map<string, ScheduleItem[]>());
    return [...hashMap.keys()].map((key) => ({
        key,
        building: hashMap.get(key)?.[0]?.building as string,
        employee: hashMap.get(key)?.[0]?.employee as string,
        date: moment(hashMap.get(key)?.[0]?.startDate as Date).startOf('day').toDate() as Date,
        items: hashMap.get(key) || [],
        office: hashMap.get(key)?.[0]?.office as string,
        specialty: hashMap.get(key)?.[0]?.specialty as string,
    }));
}

export function sortScheduleItemsByDate(columns: ScheduleColumn[]): ScheduleColumn[] {
    return columns.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function fetchScheduleData(): Promise<ScheduleItemDto[]>  {
    return Promise.resolve(ScheduleData as ScheduleItemDto[]);
}
