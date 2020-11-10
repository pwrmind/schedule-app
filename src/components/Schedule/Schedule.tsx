import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ScheduleColumn from './ScheduleColumn';
import { ScheduleColumnsHook } from './schedule.hooks';
import './Schedule.scss';

export default function Schedule() {
    const columns = useSelector((state: RootState) => state.schedule.scheduleColumns);
    const { resourcesList } = ScheduleColumnsHook();
    return (
        <Layout className='schedule'>
            {columns.map((column, i) => <ScheduleColumn scheduleColumn={column} key={column.key || i}/>)}
        </Layout>
    );
}