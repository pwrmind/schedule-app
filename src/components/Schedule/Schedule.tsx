import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import { getDayTimeIntervals, fetchScheduleData, mapListScheduleItemToDomainList } from './Schedule.module';
import { ScheduleItem } from './Schedule.models';
import './Schedule.scss';

export default function Schedule() {
    const [timeIntervals] = useMemo(() => getDayTimeIntervals(30, 7, 20), []);
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        fetchScheduleData()
            .then((data) => mapListScheduleItemToDomainList(data))
            .then((data) => setScheduleData(data));
    }, []);


    return (
        <Layout>
            
        </Layout>
    );
}