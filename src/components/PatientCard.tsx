import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Client } from './Schedule/schedule.models';

interface DefaultProps {
    client: Client;
}

export default function PatientCard(props: DefaultProps) {

    return (
        <Card bordered={false} style={{width: '100%', margin: '24px 0px 0px 0px'}} bodyStyle={{padding: 0}}>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }} gutter={[8, 8]}>
                <Col span={8}>
                    <Typography.Text strong>Имя</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{props.client.fullName}</Typography.Text>
                </Col>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }} gutter={[8, 8]}>
                <Col span={8}>
                    <Typography.Text strong>Дата рождения</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{props.client.birthDate}</Typography.Text>
                </Col>
            </Row>
            <Row align='middle' justify='start' style={{ padding: '4px 0px' }} gutter={[8, 8]}>
                <Col span={8}>
                    <Typography.Text strong>Полис ОМС</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{props.client.OMS}</Typography.Text>
                </Col>
            </Row>
        </Card>
    );
}