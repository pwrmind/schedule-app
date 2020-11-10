import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';


export function ScheduleColumnsHook() {
    const resourcesList = useSelector((state: RootState) => {
        const [startMoment, endMoment] =  state.params.dateRange;
        return state.schedule.resources.filter((v) => v.intervalTill >= endMoment && v.intervalFrom <= startMoment);
    });
    const scheduleDays = useSelector((state: RootState) =>  state.params.dateRange[1].diff(state.params.dateRange[0], 'day'));
    

    return { resourcesList, scheduleDays };
}
