import React, { useMemo } from 'react';
import { Layout, Row, Typography, Card } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store/store';
import { mapAvailableResourceToTimeIntervals, fullNameToShortForm, filterAppointmentByResourceIdAndDate,
    mapAppointmentsToScheduleCells, mapIntervalEmployeeTasksToScheduleCells, dateMatchInterval, dateMatchAvailableDay } from './schedule.module';
import { ScheduleColumn as ScheduleColumnInterface, AvailableResource } from './schedule.models';
import ScheduleCell from './ScheduleCell';
import './ScheduleColumn.scss';
import { DEFAULT_TIME_FORMAT } from '../../constants';

interface DefaultProps {
    scheduleColumn: ScheduleColumnInterface;
}

export default function ScheduleColumn(props: DefaultProps) {
    const {scheduleColumn: {date, employee, building, office, specialty, resourceId}} = props;
    
    const resource = useSelector((state: RootState) => state.schedule.resources.find(value => {
        return value.fullName === employee && value.building === building && value.specialty === specialty && value.office === office;
    }) as AvailableResource);

    const appointments = useSelector((state: RootState) => filterAppointmentByResourceIdAndDate(state.schedule.appointments, resourceId, date));

    const intervalEmployeeTasks = useSelector((state: RootState) => state.schedule.intervalEmployeeTasks.filter(v => v.resourceId === resourceId));

    const timeIntervals: string[] = useMemo(() => resource ? mapAvailableResourceToTimeIntervals(resource, appointments) : [], [resource, appointments]);

    const scheduleCells =  useMemo(() =>
    mapIntervalEmployeeTasksToScheduleCells( 
        mapAppointmentsToScheduleCells(timeIntervals, appointments, date, resourceId, resource.workingHourStep),
        intervalEmployeeTasks, date, resourceId, resource.workingHourStep)
    , [appointments, timeIntervals, date, resourceId, intervalEmployeeTasks, resource.workingHourStep]);

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
            <Card bordered={false} style={{backgroundColor: '#d9f7be'}}>
                <Typography.Text className='schedule-column__resource-title'>{`${resource.startWorkingHour}-${resource.endWorkingHour}`}</Typography.Text>
                {intervalEmployeeTasks.filter(task => dateMatchInterval(date, task.intervalFrom, task.intervalTill) && dateMatchAvailableDay(task.days, date))
                .map((task, i) => {
                    return (
                        <Typography.Text key={i} className='schedule-column__resource-title'>{`${task.title} (${task.timeFrom}-${task.timeTill})`}</Typography.Text>
                    );
                })}
            </Card>
            <Layout className='schedule-column__cells'>
                {scheduleCells.map((v, i) => <ScheduleCell key={i} scheduleCell={v} />)}
            </Layout>
        </Layout>
    );
}