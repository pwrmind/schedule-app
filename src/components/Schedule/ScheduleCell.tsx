import React, { CSSProperties } from 'react';
import { Row, Col, Typography} from 'antd';
import moment from 'moment';
import { ScheduleCell as ScheduleCellInterface, TimeIntervalType } from './schedule.models';
import { DEFAULT_TIME_FORMAT, DEFAULT_CELL_SIZE } from '../../constants';
import './ScheduleCell.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const scheduleCellColors = new Map<string, string>();
scheduleCellColors.set(TimeIntervalType.RESERVED as string, "#b7eb8f");
scheduleCellColors.set(TimeIntervalType.AVAILABLE_FOR_APPOINTMENT as string, "#ffffff");

interface DefaultProps {
    scheduleCell: ScheduleCellInterface;
}

export default function ScheduleCell(props: DefaultProps) {
    const {appointment, size, type, startTime} = props.scheduleCell;
    const style: CSSProperties = {
        height: `${size * DEFAULT_CELL_SIZE}px`,
        backgroundColor: scheduleCellColors.get(type),
    };
    const client = useSelector((state: RootState) => appointment && appointment.clientId && state.schedule.clients.find((v) => v.id === appointment.clientId));
    return (
        <Row align='stretch' justify='start' className='schedule-cell' style={style}>
            <Col span={4} className='schedule-cell__column'>
                <Typography.Text  className='schedule-cell__text'>{moment(startTime).format(DEFAULT_TIME_FORMAT)}</Typography.Text>
            </Col>
            {
                client && props.scheduleCell.type === TimeIntervalType.RESERVED ?
                <Col span={20} className='schedule-cell__column'>
                    <Typography.Text  className='schedule-cell__text'>{client.fullName}</Typography.Text>
                </Col>
                : null
            }
        </Row>
    );
}