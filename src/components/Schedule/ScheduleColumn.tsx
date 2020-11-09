import React from 'react';
import { Layout, Row, Space, Typography } from 'antd';
import { ScheduleColumn as ScheduleColumnInterface } from './Schedule.models';
import moment from 'moment';
import './ScheduleColumn.scss';

interface DefaultProps {
    timeIntervals: string[];
    scheduleColumn: ScheduleColumnInterface;
}

export default function ScheduleColumn(props: DefaultProps) {
    const {scheduleColumn: {date, employee, building}} = props;
    return (
        <Layout className='schedule-column'>
            <Row align='middle' justify='center' className='schedule-column__day'>
                <Typography.Text>{`${moment(date).locale('ru-RU').format('ddd')}, ${moment(date).locale('ru-RU').format('DD MMM.')}`}</Typography.Text>
            </Row>
            
        </Layout>
    );
}