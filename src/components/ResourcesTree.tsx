import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Tree, Space, Radio, Row, Col, Dropdown, Menu, Typography, AutoComplete } from 'antd';
import { OptionData } from 'rc-select/lib/interface';
import { Store } from 'antd/lib/form/interface';
import { FilterOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';
import { RadioChangeEvent } from 'antd/lib/radio';
import { RootState } from '../store/store';
import { AvailableResource } from './Schedule/schedule.models';
import { setSelectedResources } from './Schedule/schedule.slice';
import { setEmployeeQuery } from './params.slice';

import './ResourcesTree.scss';

type CustomDataNode = DataNode & Store;

function generateResourcesTreeBySpecialties(data: AvailableResource[], query: string): CustomDataNode[] {
    return [...new Set(data.map((item) => item.specialty as string))]
        .map((specialty, i) => ({
            key: specialty,
            title: data.find((value) => value.specialty === specialty)?.specialty,
            checkable: true,
            children: generateResourcesTreeByFullName(data, specialty, query) as CustomDataNode[],
        }));
}

function generateResourcesTreeByFullName(data: AvailableResource[], specialty: string, query: string): CustomDataNode[] {
    const pattern = new RegExp(query || '', 'gim');
    return [...new Set(data.filter((item) => item.specialty === specialty)
        .map((item) => item.fullName as string))]
        .filter((v) => pattern.test(v))
        .map((fullName, i) => ({
            key: fullName,
            title: data.find((value) => value.fullName === fullName && value.specialty === specialty)?.fullName,
            checkable: true,
            resource: data.find(v => v.fullName === fullName && v.specialty === specialty)
        }));
}

function resourcesToOptionsMap(resource: AvailableResource): OptionData {
    return {
        key: resource.id,
        value: resource.fullName,
        label: <Typography.Text>{resource.fullName}</Typography.Text>
    }
}

function ResourcesTreeHeader(props: {selectAll: (...args: any) => any, unselectAll: (...args: any) => any}) {
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
                        onChange={(value: string, option: Store) => setValue(value)}
                        onSearch={(value: string) => dispatch(setEmployeeQuery(value))}
                        onSelect={(value: string) => dispatch(setEmployeeQuery(value))}
                        style={{width: '100%'}}
                    >
                        <Input.Search value={query} onChange={(ev: ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value)} size='middle' placeholder='Введите текст для поиска' enterButton />
                    </AutoComplete>
                </Col>
                <Col span={4}>
                    <Dropdown.Button
                        overlay={
                            <Menu>
                                <Menu.Item onClick={() => props.selectAll()}>
                                    <Typography.Text>Выбрать все</Typography.Text>
                                </Menu.Item>
                                <Menu.Item onClick={() => props.unselectAll()}>
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
    const dispatch = useDispatch();
    const resourcesData = useSelector((state: RootState) => state.schedule.resources);
    const employeeQuery = useSelector((state: RootState) => state.params.employeeQuery);
    const [nodeProps, setNodeProps] = useState<CustomDataNode[]>([]);
    const [sortType, setSortType] = useState('1');
    const [checkedKeys, setCheckedKeys] = useState<any>([]);
    useEffect(() => {
        setNodeProps(generateResourcesTreeBySpecialties(resourcesData, employeeQuery));
    }, [resourcesData, employeeQuery]);

    const selectAll = (nodes: CustomDataNode[]) => {
        setCheckedKeys(nodes.map((v) => [v.key, ...v.children?.map(c => c.key)]).filter(v => !!v).flat());
        dispatch(setSelectedResources(nodes.map(n => n.children || [] as CustomDataNode[]).flat().map(r => r.resource)));
    };

    const unselectAll = () => {
        setCheckedKeys([]);
        dispatch(setSelectedResources([]));
    };

    return (
        <Space direction='vertical' size='large' className='resources-tree'>
            <ResourcesTreeHeader selectAll={() => selectAll(nodeProps)} unselectAll={() => unselectAll()}/>
            <Radio.Group value={sortType} onChange={(ev: RadioChangeEvent) => setSortType(ev.target.value)} className='resources-tree__sort-type-group' style={{margin: '12px 0px'}}>
                <Radio.Button value='1' className='resources-tree__sort-type-group__button'>По специальностям</Radio.Button>
                <Radio.Button value='2' className='resources-tree__sort-type-group__button'>По алфавиту</Radio.Button>
            </Radio.Group>
            <Tree
                checkable
                defaultExpandAll={true}
                defaultExpandParent={true}
                treeData={nodeProps}
                checkedKeys={checkedKeys}
                onCheck={(checked: any, info: any) => {
                    setCheckedKeys(checked);
                    dispatch(setSelectedResources(
                        info.checkedNodes
                        .filter((v: any) => !!v.resource)
                        .map((v: any) => v.resource)
                    ));
                }}
            />
        </Space>
    );
}