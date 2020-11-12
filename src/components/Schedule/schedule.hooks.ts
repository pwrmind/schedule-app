import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import { ScheduleColumn } from './schedule.models';
import { getColumnsByDatesAndResources } from './schedule.module';


export function ScheduleColumnsHook() {
    const startDate = useSelector((state: RootState) => state.params.startDate);
    const endDate = useSelector((state: RootState) => state.params.endDate);
    const resourcesList = useSelector((state: RootState) => {
        return state.schedule.resources
            .filter((v) => moment(v.intervalFrom).startOf('day').isBefore(moment(startDate).startOf('day')))
            .filter((v) => state.schedule.selectedResources.length ? 
                state.schedule.selectedResources.some((r) => r.id === v.id)
                : true);
    });
    const rangeDaysCount = useMemo(() => moment(endDate).diff(moment(startDate), 'day') || 1, [startDate, endDate]);
    const dates = useMemo(() => Array(rangeDaysCount).fill(0).map((d, i) => moment(startDate).add(i, 'day').format(DEFAULT_DATE_FORMAT)), [rangeDaysCount, startDate]);
    const columns: ScheduleColumn[] = useMemo(() => getColumnsByDatesAndResources(dates, resourcesList), [dates, resourcesList])

    return { resourcesList, rangeDaysCount, columns };
}

