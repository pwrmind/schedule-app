import React, { useEffect, useState, Fragment, ChangeEvent } from 'react';
import { AutoComplete, Row, Col, Typography, Input, Dropdown, Menu } from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { UserOutlined } from '@ant-design/icons';
import './PatienceSearch.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Client } from './Schedule/schedule.models';


function patientsToOptionsMap(patient: Client): OptionData {
    return {
        key: patient.OMS,
        value: patient.fullName,
        label: <Typography.Text>{patient.fullName}</Typography.Text>
    }
}

function PatientDropdownMenu(props: {onClear: (...args: any) => any}) {
    return (
        <Menu>
            <Menu.Item onClick={() => props.onClear()}>
                <Typography.Text>Завершить работу с пациентом</Typography.Text>
            </Menu.Item>
        </Menu>
    );
}

export default function PatientSearch() {
    const patients = useSelector((state: RootState) => state.schedule.clients);
    const [options, setOptions] = useState<OptionData[]>([]);
    const [query, setQuery] = useState<string>('');
    const [value, setValue] = useState<string>('');
    useEffect(() => {
        const pattern = new RegExp(query || '', 'gim');
        setOptions(() => patients.filter(v => pattern.test(v.fullName) || pattern.test(v.OMS)).map(patientsToOptionsMap));
    }, [patients, query]);
    const onClear = () => {setValue(''); setQuery('')};
    return (
        <Fragment>
            <Row align='middle' justify='space-between' className='patient-search'>
                <Col span={20} className='patient-search__column'>
                    <Typography.Title level={5} className='patient-search__section-title'>Пациент</Typography.Title>
                </Col>
                <Col span={4} className='patient-search__column'>
                    <Dropdown.Button overlay={<PatientDropdownMenu key='0' onClear={onClear}/>} icon={<UserOutlined />} />
                </Col>
            </Row>
            <AutoComplete
                value={value}
                options={options} className='patient-search__autocomplete'
                onChange={(value: string) => setValue(value)}
            >
                <Input.Search value={query} onChange={(ev: ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)} size='middle' placeholder='Enter value for search...' enterButton />
            </AutoComplete>
        </Fragment>
    );
}