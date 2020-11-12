import React, { useEffect, useState, Fragment, ChangeEvent } from 'react';
import { AutoComplete, Row, Col, Typography, Input, Dropdown, Menu } from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { UserOutlined } from '@ant-design/icons';
import './PatienceSearch.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Client } from './Schedule/schedule.models';
import { Store } from 'antd/lib/form/interface';
import { setSelectedPatient } from './Schedule/schedule.slice';
import { CSSProperties } from 'styled-components';

type CustomOption = OptionData & Store;

function patientsToOptionsMap(patient: Client): CustomOption {
    const textStyle: CSSProperties = {whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', fontSize: '12px'};
    return {
        key: patient.OMS,
        value: patient.fullName,
        label: (<Row align='bottom' justify='space-between' gutter={[8, 8]}>
                    <Col span={12} style={{overflow: 'hidden'}}>
                        <Typography.Text ellipsis={true} style={textStyle}>{patient.fullName}</Typography.Text>
                    </Col>
                    <Col span={12}>
                        <Typography.Text style={textStyle}>{patient.OMS}</Typography.Text>
                    </Col>
                </Row>),
        patient,
    }
}

function PatientDropdownMenu(props: { onClear: (...args: any) => any }) {
    return (
        <Menu>
            <Menu.Item onClick={() => props.onClear()}>
                <Typography.Text>Завершить работу с пациентом</Typography.Text>
            </Menu.Item>
        </Menu>
    );
}

export default function PatientSearch() {
    const dispatch = useDispatch();
    const patients = useSelector((state: RootState) => state.schedule.clients);
    const [options, setOptions] = useState<OptionData[]>([]);
    const [query, setQuery] = useState<string>('');
    const [value, setValue] = useState<string>('');
    useEffect(() => {
        const pattern = new RegExp(query || '', 'gim');
        setOptions(() => patients.filter(v => pattern.test(v.fullName) || pattern.test(v.OMS)).map(patientsToOptionsMap));
    }, [patients, query]);
    const onClear = () => {
        setValue('');
        setQuery('');
        dispatch(setSelectedPatient(null));
    };
    return (
        <Fragment>
            <Row align='middle' justify='space-between' className='patient-search'>
                <Col span={20} className='patient-search__column'>
                    <Typography.Title level={5} className='patient-search__section-title'>Пациент</Typography.Title>
                </Col>
                <Col span={4} className='patient-search__column'>
                    <Dropdown.Button overlay={<PatientDropdownMenu onClear={onClear} />} icon={<UserOutlined />} />
                </Col>
            </Row>
            <AutoComplete
                value={value}
                options={options} className='patient-search__autocomplete'
                onChange={(value: string) => setValue(value)}
                onSelect={(value: string, option: any) => dispatch(setSelectedPatient(option.patient))}
            >
                <Input.Search value={query} onChange={(ev: ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)} size='middle' placeholder='Введите текст для поиска' enterButton />
            </AutoComplete>
        </Fragment>
    );
}