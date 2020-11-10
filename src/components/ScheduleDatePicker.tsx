import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RangeValue } from 'rc-picker/lib/interface';
import { RangeInfo } from 'rc-picker/lib/RangePicker';
import { setDateRange } from './params.slice';

const { RangePicker } = DatePicker;

function disabledDate(current: Moment) {
    return current && current <= moment().startOf('day');
}

export default function ScheduleDatePicker() {
    const dispatch = useDispatch();
    const range = useSelector((state: RootState) => state.params.dateRange.map((v) => moment(v)) as [Moment, Moment]);
    const onCalendarChange = (values: RangeValue<Moment>, formatString: [string, string], info: RangeInfo) => {
        if (values?.every(v => !!v)) {
            const payload = values.map(v => (v as Moment).startOf('day')) as [Moment, Moment];
            dispatch(setDateRange(payload));
        }
    }
    return (
        <RangePicker disabledDate={disabledDate} defaultValue={range} onCalendarChange={onCalendarChange}/>
    );
}