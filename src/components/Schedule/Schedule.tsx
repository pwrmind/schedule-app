import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import { getDayTimeIntervals, fetchScheduleData, mapListScheduleItemToDomainList,
    mapScheduleItemsToColumn, sortScheduleItemsByDate } from './Schedule.module';
import { ScheduleItem, ScheduleColumn } from './Schedule.models';
import './Schedule.scss';

export default function Schedule() {
    const [timeIntervals] = useMemo(() => getDayTimeIntervals(30, 7, 20), []);
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [columns, setColumns] = useState<ScheduleColumn[]>([]);

    useEffect(() => {
        fetchScheduleData()
            .then((data) => mapListScheduleItemToDomainList(data))
            .then((data) => setScheduleData(data));
    }, []);

    useEffect(() => setColumns(
        sortScheduleItemsByDate(mapScheduleItemsToColumn(scheduleData))),
        [scheduleData]);

    return (
        <Layout className='schedule'>
            
        </Layout>
    );
}