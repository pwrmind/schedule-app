import React, { CSSProperties, useRef, useState } from 'react';
import { Row, Col, Typography, Modal, Button, notification } from 'antd';
import moment from 'moment';
import { ScheduleCell as ScheduleCellInterface, TimeIntervalType, Client, AvailableResource } from './schedule.models';
import { DEFAULT_TIME_FORMAT, DEFAULT_CELL_SIZE } from '../../constants';
import './ScheduleCell.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AppointmentForm from '../AppointmentForm';
import { FormInstance } from 'antd/lib/form';
import { replaceAppointment } from './schedule.slice';

const scheduleCellColors = new Map<string, string>();
scheduleCellColors.set(TimeIntervalType.RESERVED as string, "#b7eb8f");
scheduleCellColors.set(TimeIntervalType.AVAILABLE_FOR_APPOINTMENT as string, "#ffffff");
scheduleCellColors.set(TimeIntervalType.WORKING_WITH_DOCUMENTS as string, "#bfbfbf");
scheduleCellColors.set(TimeIntervalType.TRAINING as string, "#d3adf7");

interface DefaultProps {
    scheduleCell: ScheduleCellInterface;
}

export default function ScheduleCell(props: DefaultProps) {
    const { appointment, size, type, startTime, resourceId, endTime } = props.scheduleCell;
    const dispatch = useDispatch();
    const formRef = useRef<FormInstance | null>(null);
    const [visible, setVisible] = useState(false);

    const style: CSSProperties = {
        height: `${size * DEFAULT_CELL_SIZE}px`,
        backgroundColor: scheduleCellColors.get(type),
    };

    const client = useSelector((state: RootState) => appointment && appointment.clientId && state.schedule.clients.find((v) => v.id === appointment.clientId));

    const resource = useSelector((state: RootState) => state.schedule.resources.find((v) => v.id === resourceId) as AvailableResource);

    const onOk = () => formRef.current?.submit();

    const removeAppointment = () => {
        if (props.scheduleCell.appointment) {
            dispatch(replaceAppointment(props.scheduleCell.appointment));
            notification.warning({
                message: 'Appointment was deleted',
                duration: 10,
            });
            setVisible(false);
        }
    };

    return (
        <Row align='stretch' justify='start' className='schedule-cell' style={style} onDoubleClick={() => setVisible(true)}>
            <Col span={4} className='schedule-cell__column'>
                <Typography.Text className='schedule-cell__text'>{moment(startTime).format(DEFAULT_TIME_FORMAT)}</Typography.Text>
            </Col>
            {
                client && props.scheduleCell.type === TimeIntervalType.RESERVED ?
                    <Col span={20} className='schedule-cell__column'>
                        <Typography.Text className='schedule-cell__text'>{client.fullName}</Typography.Text>
                    </Col>
                    : null
            }
            {
                [TimeIntervalType.TRAINING, TimeIntervalType.WORKING_WITH_DOCUMENTS].includes(props.scheduleCell.type) ?
                    <Col span={20} className='schedule-cell__column'>
                        <Typography.Text className='schedule-cell__text'>{props.scheduleCell.title}</Typography.Text>
                    </Col>
                    : null
            }
            <Modal
                visible={visible}
                title={client ? `Change appointment for ${client.fullName}` : 'Add new appointment'}
                onOk={() => onOk()}
                onCancel={() => setVisible(false)}
                destroyOnClose={true}
                footer={
                    <Row align='middle' justify='end' gutter={[8, 8]}>
                        <Button type='primary' onClick={() => onOk()}>Save</Button>
                        <Button type='primary' onClick={() => removeAppointment()} danger disabled={!appointment}>Delete</Button>
                        <Button type='ghost' onClick={() => setVisible(false)}>Close</Button>
                    </Row>
                }
            >
                <AppointmentForm
                    ref={formRef}
                    client={client as Client}
                    scheduleCell={props.scheduleCell}
                    resource={resource}
                    defaultStartTime={startTime}
                    defaultEndTime={endTime}
                    onSubmit={() => setVisible(false)}
                />
            </Modal>
        </Row>
    );
}