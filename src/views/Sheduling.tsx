
import React from 'react';
import { Layout, Typography} from 'antd';
import { CustomRoute } from '../router/routes';
import SchedulingSideMenu from '../components/SchedulingSideMenu';
import ScheduleHeader from '../components/ScheduleHeader';
import Schedule from '../components/Schedule';
import './Sheduling.scss';

const { Header, Content } = Layout;

export default function Scheduling(props: { routes?: CustomRoute[] }) {
    return (
        <Layout className='sheduling'>
            <SchedulingSideMenu />
            <Layout className='sheduling__content'>
                <ScheduleHeader />
                <Content>
                    <Schedule />
                </Content>
            </Layout>
        </Layout>
    );
}