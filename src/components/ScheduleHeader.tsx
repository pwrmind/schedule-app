import React from 'react';
import { Layout, PageHeader, Typography, Radio } from 'antd';
import './ScheduleHeader.scss';

const { Header } = Layout;

export default function ScheduleHeader() {
    return (
        <Header className='sheduling-header'>
            <PageHeader
                className='sheduling-header__page-header'
                title={<Typography.Title level={4}>Stuff schedue</Typography.Title>}
                extra={[
                    <Radio.Group defaultValue='1' key='1'>
                        <Radio.Button value='1'>1 day</Radio.Button>
                        <Radio.Button value='2'>2 days</Radio.Button>
                        <Radio.Button value='3'>Week</Radio.Button>
                    </Radio.Group>
                ]}
            />
        </Header>
    );
}