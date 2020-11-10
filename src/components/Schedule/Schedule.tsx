import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { getDayTimeIntervals } from './schedule.module';
import ScheduleColumn from './ScheduleColumn';
import './Schedule.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function Schedule() {
    const timeIntervals = useMemo<string[]>(() => getDayTimeIntervals(30, 7, 20) as string[], []);
    const columns = useSelector((state: RootState) => state.schedule.scheduleColumns);

    return (
        <Layout className='schedule'>
            {columns.map((column, i) => <ScheduleColumn scheduleColumn={column} timeIntervals={timeIntervals} key={column.key || i}/>)}
        </Layout>
    );
}