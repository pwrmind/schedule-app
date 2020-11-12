
import React from 'react';
import { Layout } from 'antd';
import { CustomRoute } from '../router/routes';
import SchedulingSideMenu from '../components/SchedulingSideMenu';
import ScheduleHeader from '../components/ScheduleHeader';
import Schedule from '../components/Schedule/Schedule';
import './Sheduling.scss';

export default function Scheduling(props: { routes?: CustomRoute[] }) {
    return (
        <Layout className='sheduling'>
            <SchedulingSideMenu />
            <Layout className='sheduling__content'>
                <ScheduleHeader />
                <Layout.Content>
                    <Schedule />
                </Layout.Content>
            </Layout>
        </Layout>
    );
}