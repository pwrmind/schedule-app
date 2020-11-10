import React from 'react';
import { Row, Col, Typography} from 'antd';
import { AvailableResource } from './schedule.models';
import './ScheduleCell.scss'

interface DefaultProps {
    intervalTitle: string;
}

export default function ScheduleCell(props: DefaultProps) {
    return (
        <Row align='stretch' justify='start' className='schedule-cell'>
            <Col span={4} className='schedule-cell__column'>
                <Typography.Text  className='schedule-cell__text'>{props.intervalTitle}</Typography.Text>
            </Col>
        </Row>
    );
}