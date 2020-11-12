import React, { useState } from 'react';
import { Layout, Divider } from 'antd';
import PatientSearch from './PatienceSearch';
import ResourcesTree from './ResourcesTree';
import ScheduleDatePicker from './ScheduleDatePicker';
import PatientCard from './PatientCard';
import './SchedulingSideMenu.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


const { Sider } = Layout;

export default function SchedulingSideMenu() {
    const [siderIsCollapsed] = useState(false);
    const selectedPatient = useSelector((state: RootState) => state.schedule.selectedPatient);
    return (
        <Sider trigger={null} collapsible collapsed={siderIsCollapsed} width={400} theme='light' className='side-menu'>
            <PatientSearch />
            {selectedPatient ? <PatientCard client={selectedPatient}/> : null}
            <Divider />
            <ScheduleDatePicker />
            <Divider />
            <ResourcesTree />
        </Sider>
    );
}