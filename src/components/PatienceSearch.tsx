import React, { useEffect, useState, Fragment } from 'react';
import { AutoComplete, Row, Col, Typography, Input, Dropdown, Menu } from 'antd';
import patientsMocks from '../mocks/patients.json';
import { Store } from 'antd/lib/form/interface';
import { OptionData } from 'rc-select/lib/interface';
import { UserOutlined } from '@ant-design/icons';
import './PatienceSearch.scss';


function patientsToOptionsMap(patient: Store): OptionData {
    return {
        value: patient.fullName,
        label: <Typography.Text>{patient.fullName}</Typography.Text>
    }
}

function patientDropdownMenu() {
    return (
        <Menu>
            <Menu.Item>
                <Typography.Text>Complete work with the patient</Typography.Text>
            </Menu.Item>
        </Menu>
    );
}

export default function PatientSearch() {
    const [patients] = useState<Store[]>(patientsMocks);
    const [options, setOptions] = useState<OptionData[]>([]);
    useEffect(() => {
        setOptions(() => patients.map(patientsToOptionsMap));
    }, [patients])
    return (
        <Fragment>
            <Row align='middle' justify='space-between' className='patient-search'>
                <Col span={20} className='patient-search__column'>
                    <Typography.Title level={5} className='patient-search__section-title'>Patients</Typography.Title>
                </Col>
                <Col span={4} className='patient-search__column'>
                    <Dropdown.Button overlay={patientDropdownMenu} icon={<UserOutlined />} />
                </Col>
            </Row>
            <AutoComplete options={options} className='patient-search__autocomplete'>
                <Input.Search size='middle' placeholder='Enter value for search...' enterButton />
            </AutoComplete>
        </Fragment>
    );
}