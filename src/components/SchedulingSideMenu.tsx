import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment, { Moment } from 'moment';
import { Layout, Divider, Typography } from 'antd';
import PatientSearch from './PatienceSearch';
import ResourcesTree from './ResourcesTree';
import ScheduleDatePicker from './ScheduleDatePicker';
import { setDateRange } from './params.slice';
import './SchedulingSideMenu.scss';
import { RootState } from '../store/store';


const { Sider } = Layout;

export default function SchedulingSideMenu() {
    const dispatch = useDispatch();
    const [siderIsCollapsed] = useState(false);
    const canSelectDates = useSelector((state: RootState) => state.params.dateRange.length === 2);
    useEffect(() => {
        const range = [moment().startOf('day'), moment().add(1, 'week').startOf('day')] as [Moment, Moment];
        dispatch(setDateRange(range))
    }, []);
    return (
        <Sider trigger={null} collapsible collapsed={siderIsCollapsed} width={400} theme='light' className='side-menu'>
            <PatientSearch />
            <Divider />
            <Typography.Title level={5}>Appointment date</Typography.Title>
            {canSelectDates ? <ScheduleDatePicker /> : null}
            <Divider />
            <ResourcesTree />
        </Sider>
    );
}