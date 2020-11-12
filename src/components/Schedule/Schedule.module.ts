import { Store } from "antd/lib/form/interface";
import { ScheduleItem, ScheduleItemDto, TimeIntervalType, ScheduleColumn, AvailableResource, AvailableResourceDto, Appointment, ScheduleCell, IntervalEmployeeTask } from "./schedule.models";
import moment from 'moment'
import { DEFAULT_DATE_TIME_FORMAT } from "../../constants";

function getDayTimeIntervals(interval: number, fromHour = 0, tillHour = 24) {
    return Array(24)
        .fill(0)
        .map((v, i) => i)
        .filter((v) => (v >= fromHour) && (v < tillHour))
        .map((v) => [v, Array(60 / interval).fill(0).map((j, i) => i * interval)] as [number, number[]])
        .map((v) => v[1].map((j) => (v[0] > 9 ? '' + v[0] : '0' + v[0]) + ':' + (j > 9 ? '' + j : '0' + j)))
        .flat();
}

export function mapAvailableResourceToTimeIntervals(resource: AvailableResource, appointments: Appointment[]): string[] {
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
                resourceId: resource.id,
                items: [],
                date: key,
                employee: resource.fullName,
            } as ScheduleColumn
        )) || [];
    }).flat();
}

export function filterAppointmentByResourceIdAndDate(appointments: Appointment[], resourceId: number, date: string) {
    return appointments.filter((v) => moment(v.date).startOf('day').diff(moment(date).startOf('day'), 'day') === 0
        && v.resourceId === resourceId);
}

export function mapAppointmentsToScheduleCells(timeIntervals: string[], appointments: Appointment[], date: string, resourceId: number, minutesStep: number): ScheduleCell[] {
    const intervals: ScheduleCell[] = [...timeIntervals].map((interval) => ({
        startTime: moment(`${date} ${interval}`).format(DEFAULT_DATE_TIME_FORMAT),
        endTime: moment(`${date} ${interval}`).add(minutesStep, 'minute').format(DEFAULT_DATE_TIME_FORMAT),
        size: 1,
        resourceId,
        type: TimeIntervalType.AVAILABLE_FOR_APPOINTMENT,
    }));
    appointments.forEach((appointment) => {
        const startTime = moment(appointment.startTime);
        const endTime = moment(appointment.endTime);
        const startIndex = intervals.findIndex((v) => moment(v.startTime).diff(moment(startTime), 'minute') === 0);
        const endIndex = intervals.findIndex((v) => moment(v.endTime).diff(moment(endTime), 'minute') === 0);
        if (startIndex >= 0 && endIndex >= 0) {
            intervals.splice(startIndex, endIndex - startIndex + 1);
            intervals.splice(startIndex, 0, {
                type: appointment.type as TimeIntervalType,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                size: endIndex - startIndex + 1,
                resourceId,
                appointment,
            });
        }
    });
    return intervals;
}


export function mapIntervalEmployeeTasksToScheduleCells(cellsWithAppointments: ScheduleCell[], intervalTasks:  IntervalEmployeeTask[], date: string,
        resourceId: number, minutesStep: number): ScheduleCell[] {
    const cells = [...cellsWithAppointments];
    const currentDate = moment(date);
    intervalTasks.forEach((interval, index) => {
        const inRangeFrom = currentDate.isAfter(moment(interval.intervalFrom), 'day') || currentDate.diff(moment(interval.intervalFrom), 'day') === 0;
        const inRangeTill = currentDate.isBefore(moment(interval.intervalTill), 'day') || currentDate.diff(moment(interval.intervalTill), 'day') === 0;
        const intervalStart = moment(`${date} ${interval.timeFrom}`);
        const intervalEnd = moment(`${date} ${interval.timeTill}`);

        if (!inRangeFrom && !inRangeTill) {
            return;
        }

        if (!interval.days.includes(intervalStart.day())) {
            return;
        }
        
        const startIndex = cells.findIndex((v) =>  moment(v.startTime).diff(moment(intervalStart), 'minute') === 0);
        let endIndex = cells.findIndex((v) =>  moment(intervalEnd).diff(moment(v.startTime), 'minute') === 0);
        const lastIndexManipulate = endIndex < 0 && index === (intervalTasks.length - 1);
        endIndex = lastIndexManipulate ?
            cells.findIndex((v) =>  moment(intervalEnd).diff(moment(v.endTime), 'minute') === 0) : endIndex;
        if (startIndex >= 0 && endIndex >= 0) {
            cells.splice(startIndex, endIndex - startIndex + (lastIndexManipulate ? 1 : 0));
            cells.splice(lastIndexManipulate ? startIndex + 1 : startIndex, 0, {
                title: interval.title,
                type: interval.type as TimeIntervalType,
                startTime: intervalStart.format(DEFAULT_DATE_TIME_FORMAT),
                endTime: intervalEnd.format(DEFAULT_DATE_TIME_FORMAT),
                size: endIndex - startIndex,
                resourceId,
            });
        }
    });

    return cells;
}

export function dateMatchInterval(date: string, intervalFrom: string, intervalTill: string) {
    const currentDate = moment(date);
    const inRangeFrom = currentDate.isAfter(moment(intervalFrom), 'day') || currentDate.diff(moment(intervalFrom), 'day') === 0;
    const inRangeTill = currentDate.isBefore(moment(intervalTill), 'day') || currentDate.diff(moment(intervalTill), 'day') === 0;
    return inRangeFrom && inRangeTill;
}

export function dateMatchAvailableDay(days: number[], day: string) {
    return days.includes(moment(day).day());
}
