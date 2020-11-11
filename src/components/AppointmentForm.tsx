import React, { forwardRef, MutableRefObject, useLayoutEffect } from 'react';
import moment from 'moment';
import { Form, Select, Typography, Row, Col, TimePicker, notification} from 'antd';
import { AvailableResource, Client, ScheduleCell, TimeIntervalType } from './Schedule/schedule.models';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DEFAULT_DATE_TIME_FORMAT, DEFAULT_TIME_FORMAT } from '../constants';
import { Store } from 'antd/lib/form/interface';
import { FormInstance } from 'antd/lib/form';
import { ForwardedRef } from 'react';
import { addAppointment, replaceAppointment } from './Schedule/schedule.slice';


interface DefaultProps {
    client?: Client;
    scheduleCell: ScheduleCell;
    resource: AvailableResource;
    defaultStartTime: string;
    defaultEndTime: string;
    onSubmit: (...args: any) => any;
}

function AppointmentForm(props: DefaultProps, ref: ForwardedRef<FormInstance<any> | null>) {
    const { resource } = props
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const clients = useSelector((state: RootState) => state.schedule.clients);
    const resources = useSelector((state: RootState) => state.schedule.resources);
    const addNewAppointment = (value: Store) => {
        dispatch(addAppointment({
            date: props.defaultStartTime,
            startTime: moment(value.from).format(DEFAULT_DATE_TIME_FORMAT),
            endTime: moment(value.to).format(DEFAULT_DATE_TIME_FORMAT),
            resourceId: value.resource,
            clientId: value.client,
            type: TimeIntervalType.RESERVED,
        }));
    };
    const removeAppointment = () => {
        if (props.scheduleCell.appointment) {
            dispatch(replaceAppointment(props.scheduleCell.appointment))
        }
    };
    const notifySuccess = (value: Store) => {
        notification.success({
            message: 'Record successfully saved!',
            description: `New appointment saved for
            ${clients.find((v) => v.id === value.client)?.fullName} 
            at ${moment(value.from).format('dd, DD.MM.YYYY')}
            ${moment(value.from).format(DEFAULT_TIME_FORMAT)}-${moment(value.to).format(DEFAULT_TIME_FORMAT)}
            `,
            duration: 10,
        })
    }
    const onFinish = (value: Store) => {
        removeAppointment();
        addNewAppointment(value);
        notifySuccess(value);
        props.onSubmit();
    }
    useLayoutEffect(() => {
       (ref as MutableRefObject<FormInstance<any>>).current = form;
    }, [form, ref, props])
    return (
        <Form
            layout='horizontal'
            labelCol={{span: 4, offset: 1}}
            labelAlign='left'
            form={form}
            onFinish={onFinish}
        >
            <Form.Item label='Client' name='client' rules={[{ required: true }]} initialValue={props.client?.id}>
                <Select
                    showSearch={true}
                    placeholder='Select client...'
                >
                    {clients.map((client) => {
                        return (
                            <Select.Option key={client.id} value={client.id}>
                                <Row align='middle' justify='space-between'>
                                    <Col span={16}>
                                        <Typography.Text>{client.fullName}</Typography.Text>
                                    </Col>
                                    <Col span={8}>
                                        <Typography.Text>{client.OMS}</Typography.Text>
                                    </Col>
                                </Row>
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item label='Stuff' name='resource' rules={[{ required: true }]} initialValue={resource.id}>
                <Select
                    showSearch={true}
                    defaultValue={resource.id}
                    placeholder='Select client...'
                >
                    {resources.map((resource) => {
                        return (
                            <Select.Option key={resource.id} value={resource.id}>
                                <Row align='middle' justify='space-between'>
                                    <Col span={16}>
                                        <Typography.Text>{resource.fullName}</Typography.Text>
                                    </Col>
                                    <Col span={8}>
                                        <Typography.Text>{resource.specialty}</Typography.Text>
                                    </Col>
                                    <Col span={8}>
                                        <Typography.Text>{`${resource.building} (${resource.office})`}</Typography.Text>
                                    </Col>
                                </Row>
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }} label='Time'>
                <Form.Item name="from" rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(45% - 8px)' }} initialValue={moment(props.defaultStartTime)}>
                    <TimePicker hourStep={1} minuteStep={resource.workingHourStep} format={DEFAULT_TIME_FORMAT} placeholder='from'/>
                </Form.Item>
                <Form.Item name="to" rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(45% - 8px)' }} initialValue={moment(props.defaultEndTime)}>
                    <TimePicker hourStep={1} minuteStep={resource.workingHourStep} format={DEFAULT_TIME_FORMAT} placeholder='to' />
                </Form.Item>
            </Form.Item>
        </Form>
    );
}

export default forwardRef(AppointmentForm);