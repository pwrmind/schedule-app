import { Store } from "antd/lib/form/interface";
import { ScheduleItem, ScheduleItemDto, TimeIntervalType, ScheduleColumn, AvailableResource, AvailableResourceDto } from "./schedule.models";
import moment from 'moment'
import { DEFAULT_DATE_FORMAT } from "../../constants";

function getDayTimeIntervals(interval: number, fromHour = 0, tillHour = 24) {
    return Array(24)
        .fill(0)
        .map((v, i) => i)
        .filter((v) => (v >= fromHour) && (v <= tillHour))
        .map((v) => [v, Array(60 / interval).fill(0).map((j, i) => i * interval)] as [number, number[]])
        .map((v) => v[1].map((j) => (v[0] > 9 ? '' + v[0] : '0' + v[0]) + ':' + (j > 9 ? '' + j : '0' + j)))
        .flat();
}

export function mapAvailableResourceToTimeIntervals(resource: AvailableResource): string[] {
    const startHour = getTimeTupleFromTimeString(resource.startWorkingHour)[0];
    const endHour = getTimeTupleFromTimeString(resource.endWorkingHour)[0];
    return getDayTimeIntervals(resource.workingHourStep, startHour, endHour);
}

export function mapScheduleItemToDomain(dto: ScheduleItemDto): ScheduleItem {
    if (!(TimeIntervalType as Store)[dto.type]) {
        throw new Error(`No such type of Time interval type`);
    }
    return { ...dto, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate), type: dto.type as TimeIntervalType };
}

export function mapListScheduleItemToDomainList(list: ScheduleItemDto[]): ScheduleItem[] {
    return list.map(mapScheduleItemToDomain);
}

export function mapResourceItemToDomain(dto: AvailableResourceDto): AvailableResource {
    return { ...dto };
}

export function mapListResourceDtoListToDomainList(list: AvailableResourceDto[]): AvailableResource[] {
    return list.map(mapResourceItemToDomain);
}

function getColumnGenericKey(item: ScheduleItem): string {
    const { startDate, employee, office, specialty, building } = item;
    return startDate.getDate() + startDate.getMonth() + startDate.getFullYear() + employee + office + specialty + building;
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
        date: moment(hashMap.get(key)?.[0]?.startDate).startOf('day').format(DEFAULT_DATE_FORMAT),
        items: hashMap.get(key) || [],
        office: hashMap.get(key)?.[0]?.office as string,
        specialty: hashMap.get(key)?.[0]?.specialty as string,
    }));
}

export function sortScheduleItemsByDate(columns: ScheduleColumn[]): ScheduleColumn[] {
    return columns.sort((a, b) => a.date > b.date ? 1 : -1);
}

export function getTimeTupleFromTimeString(time: string): [number, number] {
    const result = time.split(':').map(value => parseInt(value, 10));
    return [result[0], result[1]];
}

export function fullNameToShortForm(fullName: string) {
    const nameArr = fullName.split(' ').map(s => s.trim()).filter(s => !!s).map((s, i) => i === 0 ? s : s.slice(0, 1));
    return nameArr.length === 3 ? nameArr.map((s, i) => i === 0 ? s : s + '.').join(' ') : fullName;
}

export function inScheduleAtDay(resource: AvailableResource, date: string) {
    return resource.workingDays.includes(moment(date).day());
}

export function getColumnsByDatesAndResources(dates: string[], resources: AvailableResource[]): ScheduleColumn[] {
    const columnMap = dates.reduce((acc, date) => {
        const day = moment(date).day();
        const availableResources = resources.filter(resource => resource.workingDays.includes(day));
        acc.set(date, availableResources);
        return acc;
    }, new Map<string, AvailableResource[]>());
    return [...columnMap.keys()].map((key) => {
        return columnMap.get(key)?.map((resource) => (
            {
                building: resource.building,
                office: resource.office,
                specialty: resource.specialty,
                items: [],
                date: key,
                employee: resource.fullName,
            } as ScheduleColumn
        )) || [];
    }).flat();
}
