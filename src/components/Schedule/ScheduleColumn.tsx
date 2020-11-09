import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { getDayTimeIntervals } from './Schedule.module';
import './Schedule.scss';

export default function Schedule() {
    const [timeIntervals] = useMemo(() => getDayTimeIntervals(30, 7, 20), []);
    return (
        <section className='shedule-column'>
            
        </section>
    );
}