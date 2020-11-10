import React, { useMemo } from 'react';
import { Layout } from 'antd';
import ScheduleColumn from './ScheduleColumn';
import './Schedule.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function Schedule() {
    const columns = useSelector((state: RootState) => state.schedule.scheduleColumns);
    return (
        <Layout className='schedule'>
            {columns.map((column, i) => <ScheduleColumn scheduleColumn={column} key={column.key || i}/>)}
        </Layout>
    );
}