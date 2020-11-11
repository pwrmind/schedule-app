import React from 'react';
import moment from 'moment';
import { Form, Select, Typography, Row, Col, TimePicker } from 'antd';
import { AvailableResource, Client, ScheduleCell } from './Schedule/schedule.models';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DEFAULT_TIME_FORMAT } from '../constants';
import { Store } from 'antd/lib/form/interface';


interface DefaultProps {
    client?: Client;
    scheduleCell: ScheduleCell;
    resource: AvailableResource;
    defaultStartTime: string;
    defaultEndTime: string;
}

export default function AppointmentForm(props: DefaultProps) {
    const { resource } = props
    const [form] = Form.useForm();
    const clients = useSelector((state: RootState) => state.schedule.clients);
    const resources = useSelector((state: RootState) => state.schedule.resources);
    const onValuesChange = (changedValues: Store[], values: Store[]) => {
        console.log(changedValues);
        console.log(values);
    }
    return (
        <Form
            layout='horizontal'
            labelCol={{span: 4, offset: 1}}
            labelAlign='left'
            form={form}
            onValuesChange={onValuesChange}
        >
            <Form.Item label='Client' name='client' rules={[{ required: true }]}>
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
            <Form.Item label='Stuff' name='resource' rules={[{ required: true }]}>
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
                <Form.Item name="from" rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(45% - 8px)' }}>
                    <TimePicker hourStep={1} minuteStep={resource.workingHourStep} format={DEFAULT_TIME_FORMAT} placeholder='from' defaultValue={moment(props.defaultStartTime)}/>
                </Form.Item>
                <Form.Item name="to" rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(45% - 8px)' }}>
                    <TimePicker hourStep={1} minuteStep={resource.workingHourStep} format={DEFAULT_TIME_FORMAT} placeholder='to' defaultValue={moment(props.defaultEndTime)}/>
                </Form.Item>
            </Form.Item>
        </Form>
    );
}