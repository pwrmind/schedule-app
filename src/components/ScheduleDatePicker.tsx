import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useDispatch } from 'react-redux';
import { RangeValue } from 'rc-picker/lib/interface';
import { setStartDate, setEndDate } from './params.slice';
import locale from 'antd/es/date-picker/locale/ru_RU';

const { RangePicker } = DatePicker;

function disabledDate(current: Moment) {
    return current && current <= moment().startOf('day');
  }

export default function ScheduleDatePicker() {
    const dispatch = useDispatch();
    const onChange = (values: RangeValue<Moment>, formatString: [string, string]) => {
        console.log(formatString);
        console.log(values);
        if (values?.every(v => !!v)) {
            dispatch(setStartDate(formatString[0]));
            dispatch(setEndDate(formatString[1]));
        }
    }
    return (
        <RangePicker locale={locale} onChange={onChange} defaultValue={[moment(), moment().add(1, 'week')]} disabledDate={disabledDate}/>
    );
}