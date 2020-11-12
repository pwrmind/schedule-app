import React, { CSSProperties, Fragment, useRef, useState } from 'react';
import { Row, Col, Typography, Modal, Button, notification, Popover, Card } from 'antd';
import moment from 'moment';
import { ScheduleCell as ScheduleCellInterface, TimeIntervalType, Client, AvailableResource } from './schedule.models';
import { DEFAULT_TIME_FORMAT, DEFAULT_CELL_SIZE, DEFAULT_DATE_FORMAT } from '../../constants';
import './ScheduleCell.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AppointmentForm from '../AppointmentForm';
import { FormInstance } from 'antd/lib/form';
import { replaceAppointment } from './schedule.slice';
import { fullNameToShortForm } from './schedule.module';
import { CloseOutlined } from '@ant-design/icons';

const scheduleCellColors = new Map<string, string>();
scheduleCellColors.set(TimeIntervalType.RESERVED as string, "#b7eb8f");
scheduleCellColors.set(TimeIntervalType.AVAILABLE_FOR_APPOINTMENT as string, "#ffffff");
scheduleCellColors.set(TimeIntervalType.WORKING_WITH_DOCUMENTS as string, "#bfbfbf");
scheduleCellColors.set(TimeIntervalType.TRAINING as string, "#d3adf7");

interface DefaultProps {
    scheduleCell: ScheduleCellInterface;
}


function PopoverContent(props: DefaultProps & { client: Client | undefined, resource: AvailableResource, onClose: (...args: any) => any }) {
    const { appointment, startTime } = props.scheduleCell;
    return (
        <Card
            bordered={false}
            title={appointment ? `Запись с ${moment(appointment.startTime).format(DEFAULT_TIME_FORMAT)} по ${moment(appointment.endTime).format(DEFAULT_TIME_FORMAT)}` : ''}
            style={{ minWidth: '400px' }}
            extra={[
                <Button onClick={() => props.onClose()} icon={<CloseOutlined />} type='text' />
            ]}
        >
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }}>
                <Typography.Text strong>{fullNameToShortForm(props.client?.fullName || '')}</Typography.Text>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }}>
                <Col span={6}>
                    <Typography.Text strong>Дата</Typography.Text>
                </Col>
                <Col span={18}>
                    <Typography.Text>{moment(startTime).format(DEFAULT_DATE_FORMAT)}</Typography.Text>
                </Col>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }}>
                <Col span={6}>
                    <Typography.Text strong>Врач</Typography.Text>
                </Col>
                <Col span={18}>
                    <Typography.Text>{props.resource.fullName}</Typography.Text>
                </Col>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }}>
                <Col span={6}>
                    <Typography.Text strong>Кабинет</Typography.Text>
                </Col>
                <Col span={18}>
                    <Typography.Text>{props.resource.office}</Typography.Text>
                </Col>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }}>
                <Col span={6}>
                    <Typography.Text strong>Полис ОМС</Typography.Text>
                </Col>
                <Col span={18}>
                    <Typography.Text>{props.client?.OMS}</Typography.Text>
                </Col>
            </Row>
        </Card>
    );
}

export default function ScheduleCell(props: DefaultProps) {
    const { appointment, size, type, startTime, resourceId, endTime } = props.scheduleCell;
    const dispatch = useDispatch();
    const formRef = useRef<FormInstance | null>(null);
    const [visible, setVisible] = useState(false);
    const [showPopover, setShowPopover] = useState(false);

    const style: CSSProperties = {
        height: `${size * DEFAULT_CELL_SIZE}px`,
        backgroundColor: scheduleCellColors.get(type),
    };

    const client = useSelector((state: RootState) => !!appointment && !!appointment.clientId ? state.schedule.clients.find((v) => v.id === appointment.clientId) : undefined);

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

    const openForm = (type: string) => {
        if ([TimeIntervalType.AVAILABLE_FOR_APPOINTMENT, TimeIntervalType.RESERVED].includes(type as TimeIntervalType)) {
            setVisible(true);
        }
    }

    const openPopover = (type: string) => {
        const isValidType = [TimeIntervalType.AVAILABLE_FOR_APPOINTMENT, TimeIntervalType.RESERVED].includes(type as TimeIntervalType);
        if (isValidType && !!appointment) {
            setShowPopover(true);
        }
    }

    return (
        <Fragment>
            <Popover
                visible={showPopover && !visible}
                trigger='hover'
                content={<PopoverContent {...props} resource={resource} client={client} onClose={() => setShowPopover(false)} />}
            />
            <Row align='stretch'
                justify='start'
                className='schedule-cell'
                style={style}
                onDoubleClick={() => openForm(type)}
                onMouseEnter={() => openPopover(type)}
                onMouseLeave={() => setShowPopover(false)}
            >
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
            </Row>
            <Modal
                visible={visible}
                title={client ? `Изменение записи для  ${client.fullName}` : 'Добавить новую запись'}
                onOk={() => onOk()}
                onCancel={() => setVisible(false)}
                destroyOnClose={true}
                footer={
                    <Row align='middle' justify='end' gutter={[8, 8]}>
                        <Button type='primary' onClick={() => onOk()}>{!appointment ? 'Cоздать' : 'Изменить'}</Button>
                        <Button type='primary' onClick={() => removeAppointment()} danger disabled={!appointment}>Отменить</Button>
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
        </Fragment>
    );
}