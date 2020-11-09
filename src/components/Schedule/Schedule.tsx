import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import { getDayTimeIntervals, fetchScheduleData, mapListScheduleItemToDomainList,
    mapScheduleItemsToColumn, sortScheduleItemsByDate } from './Schedule.module';
import { ScheduleItem, ScheduleColumn as ScheduleColumnInterface } from './Schedule.models';
import ScheduleColumn from './ScheduleColumn';
import './Schedule.scss';

export default function Schedule() {
    const timeIntervals = useMemo<string[]>(() => getDayTimeIntervals(30, 7, 20) as string[], []);
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [columns, setColumns] = useState<ScheduleColumnInterface[]>([]);
    const columnsPipe = (data: ScheduleItem[]): ScheduleColumnInterface[]  => {
        return [mapScheduleItemsToColumn, sortScheduleItemsByDate].reduce((acc, func) => func(acc), data as any[]);
    }
    useEffect(() => {
        fetchScheduleData()
            .then((data) => mapListScheduleItemToDomainList(data))
            .then((data) => setScheduleData(data));
    }, []);

    useEffect(() =>  setColumns(columnsPipe(scheduleData)), [scheduleData]);

    return (
        <Layout className='schedule'>
            {columns.map((column, i) => <ScheduleColumn scheduleColumn={column} timeIntervals={timeIntervals} key={column.key || i}/>)}
        </Layout>
    );
}