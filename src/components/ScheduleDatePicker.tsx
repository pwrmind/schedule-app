import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RangeValue } from 'rc-picker/lib/interface';
import { setStartDate, setEndDate } from './params.slice';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { RootState } from '../store/store';

const { RangePicker } = DatePicker;

function disabledDate(current: Moment) {
    return current && current <= moment().startOf('day').subtract(1, 'day');
  }

export default function ScheduleDatePicker() {
    const dispatch = useDispatch();
    const [startDate, endDate] = useSelector((state: RootState) => [
        moment(state.params.startDate).startOf('day'),
        moment(state.params.endDate).endOf('day')]);
    const onChange = (values: RangeValue<Moment>, formatString: [string, string]) => {
        if (values?.every(v => !!v)) {
            dispatch(setStartDate(formatString[0]));
            dispatch(setEndDate(formatString[1]));
        }
    }
    return (
        <RangePicker locale={locale} value={[startDate, endDate]} onChange={onChange} disabledDate={disabledDate}/>
    );
}