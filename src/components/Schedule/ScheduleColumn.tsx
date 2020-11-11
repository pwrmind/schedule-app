import React, { useEffect, useMemo } from 'react';
import { Layout, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store/store';
import { mapAvailableResourceToTimeIntervals, fullNameToShortForm, filterAppointmentByResourceIdAndDate,
    mapAppointmentsToScheduleCells } from './schedule.module';
import { ScheduleColumn as ScheduleColumnInterface, AvailableResource } from './schedule.models';
import ScheduleCell from './ScheduleCell';
import './ScheduleColumn.scss';

interface DefaultProps {
    scheduleColumn: ScheduleColumnInterface;
}

export default function ScheduleColumn(props: DefaultProps) {
    const {scheduleColumn: {date, employee, building, specialty, resourceId}} = props;
    
    const resource = useSelector((state: RootState) => state.schedule.resources.find(value => {
        return value.fullName === employee && value.building === building && value.specialty === specialty;
    }) as AvailableResource);

    const appointments = useSelector((state: RootState) => filterAppointmentByResourceIdAndDate(state.schedule.appointments, resourceId, date));

    const timeIntervals: string[] = useMemo(() => resource ? mapAvailableResourceToTimeIntervals(resource, appointments) : [], [resource, appointments]);

    const scheduleCells =  useMemo(() => mapAppointmentsToScheduleCells(timeIntervals, appointments, date, resourceId), [appointments, timeIntervals, date]);

    return (
        <Layout className='schedule-column'>
            <Row align='middle' justify='center' className='schedule-column__day'>
                <Typography.Text className='schedule-column__day-title'>{`${moment(date).locale('ru-RU').format('ddd')}, ${moment(date).locale('ru-RU').format('DD MMM.')}`}</Typography.Text>
            </Row>
            <Row align='middle' justify='center' className='schedule-column__employee'>
                <Typography.Text className='schedule-column__employee-title'>{fullNameToShortForm(resource.fullName)}</Typography.Text>
            </Row>
            <Row align='middle' justify='center' className='schedule-column__specialty'>
                <Typography.Text className='schedule-column__specialty-title'>{resource.specialty}</Typography.Text>
            </Row>
            <Row align='middle' justify='center' className='schedule-column__resource'>
                <Typography.Text className='schedule-column__resource-title'>{`${resource.building} (${resource.office})`}</Typography.Text>
            </Row>
            <Layout className='schedule-column__cells'>
                {scheduleCells.map((v, i) => <ScheduleCell key={i} scheduleCell={v} />)}
            </Layout>
        </Layout>
    );
}