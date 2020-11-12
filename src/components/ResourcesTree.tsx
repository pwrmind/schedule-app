import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Input, Tree, Space, Radio, Row, Col, Dropdown, Menu, Typography, AutoComplete } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';
import { DataNode } from 'antd/lib/tree';
import { useDispatch, useSelector } from 'react-redux';
import { RadioChangeEvent } from 'antd/lib/radio';
import { RootState } from '../store/store';
import { AvailableResource } from './Schedule/schedule.models';
import './ResourcesTree.scss';
import { OptionData } from 'rc-select/lib/interface';

function generateResourcesTreeBySpecialties(data: AvailableResource[]): DataNode[] {
    return [...new Set(data.map((item) => item.specialty as string))]
        .map((specialty, i) => ({
            key: specialty + i,
            title: data.find((value) => value.specialty === specialty)?.specialty,
            checkable: true,
            children: generateResourcesTreeByFullName(data, specialty),
        }));
}

function generateResourcesTreeByFullName(data: AvailableResource[], specialty: string): DataNode[] {
    return [...new Set(data.filter((item) => item.specialty === specialty).map((item) => item.fullName as string))]
        .map((fullName, i) => ({
            key: fullName + i,
            title: data.find((value) => value.fullName === fullName && value.specialty === specialty)?.fullName,
            checkable: true
        }));
}


function resourcesToOptionsMap(resource: AvailableResource): OptionData {
    return {
        key: resource.id,
        value: resource.fullName,
        label: <Typography.Text>{resource.fullName}</Typography.Text>
    }
}

function ResourcesTreeHeader() {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<OptionData[]>([]);
    const resources = useSelector((state: RootState) => state.schedule.resources);

    useEffect(() => {
        const pattern = new RegExp(query || '', 'gim');
        setOptions(() => resources
        .filter(v => pattern.test(v.fullName))
        .reduce((acc, r) => acc.find(v => v.fullName === r.fullName) ? acc : [...acc, r], [] as AvailableResource[])
        .map(resourcesToOptionsMap));
    }, [resources, query]);

    return (
        <Fragment>
            <Row align='top' justify='space-between'>
                <Col span={20}>
                    <AutoComplete
                        value={value}
                        options={options}
                        onChange={(value: string) => setValue(value)}
                        style={{width: '100%'}}
                    >
                        <Input.Search value={query} onChange={(ev: ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)} size='middle' placeholder='Введите текст для поиска' enterButton />
                    </AutoComplete>
                </Col>
                <Col span={4}>
                    <Dropdown.Button
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Typography.Text>Выбрать все</Typography.Text>
                                </Menu.Item>
                                <Menu.Item>
                                    <Typography.Text>Отменить все выбранные</Typography.Text>
                                </Menu.Item>
                            </Menu>
                        }
                        icon={<FilterOutlined />} />
                </Col>
            </Row>
        </Fragment>
    );
}

export default function ResourcesTree() {
    const resourcesData = useSelector((state: RootState) => state.schedule.resources);
    const [nodeProps, setNodeProps] = useState<DataNode[]>([]);
    const [sortType, setSortType] = useState('1');
    useEffect(() => {
        setNodeProps(generateResourcesTreeBySpecialties(resourcesData))
    }, [resourcesData]);
    return (
        <Space direction='vertical' size='large' className='resources-tree'>
            <ResourcesTreeHeader />
            <Radio.Group value={sortType} onChange={(ev: RadioChangeEvent) => setSortType(ev.target.value)} className='resources-tree__sort-type-group' style={{margin: '12px 0px'}}>
                <Radio.Button value='1' className='resources-tree__sort-type-group__button'>По специальностям</Radio.Button>
                <Radio.Button value='2' className='resources-tree__sort-type-group__button'>По алфавиту</Radio.Button>
            </Radio.Group>
            <Tree checkable defaultExpandAll={true} defaultExpandParent={true} treeData={nodeProps} />
        </Space>
    );
}