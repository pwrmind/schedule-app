import React from 'react';
import { Layout } from 'antd';
import ScheduleColumn from './ScheduleColumn';
import { ScheduleColumnsHook } from './schedule.hooks';
import './Schedule.scss';

function Schedule() {
    const { columns } = ScheduleColumnsHook();
    return (
        <Layout className='schedule'>
            {columns.map((column, i) => <ScheduleColumn scheduleColumn={column} key={column.key || i}/>)}
        </Layout>
    );
}

export default React.memo(Schedule);