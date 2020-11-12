import React from 'react';
import moment from 'moment';
import { Layout, PageHeader, Typography, Radio } from 'antd';
import { setStartDate, setEndDate } from './params.slice';
import { DEFAULT_DATE_FORMAT } from '../constants';
import './ScheduleHeader.scss';
import { useDispatch } from 'react-redux';

const { Header } = Layout;

export default function ScheduleHeader() {
    const dispatch = useDispatch();
    const setDates = (days: number) => {
        dispatch(setStartDate(moment().startOf('day').format(DEFAULT_DATE_FORMAT)));
        dispatch(setEndDate(moment().startOf('day').add(days, 'day').format(DEFAULT_DATE_FORMAT)));
    };
    return (
        <Header className='sheduling-header'>
            <PageHeader
                className='sheduling-header__page-header'
                title={<Typography.Title level={4}>Stuff schedue</Typography.Title>}
                extra={[
                    <Radio.Group defaultValue='0'>
                        <Radio.Button value='1' onClick={() => setDates(0)}>1 day</Radio.Button>
                        <Radio.Button value='2' onClick={() => setDates(2)}>2 days</Radio.Button>
                        <Radio.Button value='3' onClick={() => setDates(7)}>Week</Radio.Button>
                    </Radio.Group>
                ]}
            />
        </Header>
    );
}