import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store/store';


export function ScheduleColumnsHook() {
    const [startMoment, endMoment] = useSelector((state: RootState) => state.params.dateRange);
    const resourcesList = useSelector((state: RootState) => {
        const [startMoment, endMoment] =  state.params.dateRange;
        return state.schedule.resources.filter((v) => v.intervalTill >= endMoment && v.intervalFrom <= startMoment);
    });
    const rangeDaysCount = useSelector((state: RootState) =>  {
        const [startMoment, endMoment] =  state.params.dateRange;
        return endMoment.diff(startMoment, 'day');
    });
    const daysArray = useMemo(() => Array(Math.abs(rangeDaysCount)).fill(0).map((d, i) => startMoment.add(i, 'day')), []);

    return { resourcesList, rangeDaysCount, daysArray };
}
