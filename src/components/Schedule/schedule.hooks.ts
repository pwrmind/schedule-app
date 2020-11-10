import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../../constants';


export function ScheduleColumnsHook() {
    const startDate = useSelector((state: RootState) => state.params.startDate);
    const endDate = useSelector((state: RootState) => state.params.endDate);
    const resourcesList = useSelector((state: RootState) => {
        return state.schedule.resources.filter((v) => new Date(v.intervalTill) >= new Date(endDate) &&
            new Date(v.intervalFrom) <= new Date(startDate));
    });
    const rangeDaysCount = useMemo(() => moment(endDate).diff(moment(startDate), 'day'), [startDate, endDate]);
    const daysArray = useMemo(() => Array(rangeDaysCount).fill(0).map((d, i) => moment(startDate).add(i, 'day').format(DEFAULT_DATE_FORMAT)), [rangeDaysCount, startDate]);

    return { resourcesList, rangeDaysCount };
}
