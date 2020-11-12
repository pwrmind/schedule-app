import React, { useState } from 'react';
import { Layout, Divider } from 'antd';
import PatientSearch from './PatienceSearch';
import ResourcesTree from './ResourcesTree';
import ScheduleDatePicker from './ScheduleDatePicker';
import './SchedulingSideMenu.scss';


const { Sider } = Layout;

export default function SchedulingSideMenu() {
    const [siderIsCollapsed] = useState(false);
    return (
        <Sider trigger={null} collapsible collapsed={siderIsCollapsed} width={400} theme='light' className='side-menu'>
            <PatientSearch />
            <Divider />
            <ScheduleDatePicker />
            <Divider />
            <ResourcesTree />
        </Sider>
    );
}