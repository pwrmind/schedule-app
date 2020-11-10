import React, { useEffect, useMemo } from 'react';
import { Layout, Row, Typography } from 'antd';
import { ScheduleColumn as ScheduleColumnInterface } from './schedule.models';
import moment from 'moment';
import './ScheduleColumn.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { mapAvailableResourceToTimeIntervals } from './schedule.module';

interface DefaultProps {
    scheduleColumn: ScheduleColumnInterface;
}

export default function ScheduleColumn(props: DefaultProps) {
    const {scheduleColumn: {date, employee, building, specialty}} = props;
    const resource = useSelector((state: RootState) => state.schedule.resources.find(value => {
        return value.fullName === employee && value.building === building && value.specialty === specialty;
    }));
    const timeCells: string[] = useMemo(() => resource ? mapAvailableResourceToTimeIntervals(resource) : [], [resource]);
    return (
        <Layout className='schedule-column'>
            <Row align='middle' justify='center' className='schedule-column__day'>
                <Typography.Text>{`${moment(date).locale('ru-RU').format('ddd')}, ${moment(date).locale('ru-RU').format('DD MMM.')}`}</Typography.Text>
            </Row>
        </Layout>
    );
}