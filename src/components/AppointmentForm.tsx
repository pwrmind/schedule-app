import React from 'react';
import { Form, Select, Typography, Row, Col, TimePicker } from 'antd';
import { AvailableResource, Client, ScheduleCell } from './Schedule/schedule.models';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DEFAULT_TIME_FORMAT } from '../constants';

interface DefaultProps {
    client?: Client;
    scheduleCell: ScheduleCell;
    resource: AvailableResource;
}

export default function AppointmentForm(props: DefaultProps) {
    const {resource} = props
    const [form] = Form.useForm();
    const clients = useSelector((state: RootState) => state.schedule.clients);
    const resources = useSelector((state: RootState) => state.schedule.resources);
    return (
        <Form
            layout={'horizontal'}
            form={form}
        >
            <Form.Item label='Client' name='client'>
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
            <Form.Item label='Stuff' name='resource'>
                <Select
                    showSearch={true}
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
            <Form.Item label='Time' name='time'>
                <TimePicker hourStep={1} minuteStep={resource.workingHourStep} format={DEFAULT_TIME_FORMAT}/>
            </Form.Item>
        </Form>
    );
}