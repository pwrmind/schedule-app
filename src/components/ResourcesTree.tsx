import React, { useEffect, useState } from 'react';
import { Input, Tree, Space, Radio } from 'antd';
import { Store } from 'antd/lib/form/interface';
import ResourcesData from '../mocks/resources.json';
import './ResourcesTree.scss';
import { DataNode } from 'antd/lib/tree';


function generateResourcesTreeBySpecilaties(data: Store[]): DataNode[] {
    return [...new Set(data.map((item) => item.specialty as string))]
    .map((specialty, i) => ({
        key: specialty + i,
        title: data.find((value) => value.specialty === specialty)?.specialty,
        checkable: true,
        children: data.filter((value) => value.specialty === specialty)
            .map((value, i) => ({
                key: specialty + i + value.fullName,
                title: value.fullName,
                checkable: true,
            }))
    }))
}

export default function ResourcesTree() {
    const [resourcesData] = useState<Store[]>(ResourcesData);
    const [nodeProps, setNodeProps] = useState<DataNode[]>([]);
    useEffect(() => {
        setNodeProps(generateResourcesTreeBySpecilaties(resourcesData))
    }, [resourcesData]);
    return (
        <Space direction='vertical' size='large' className='resources-tree'>
            <Input.Search placeholder='Type some text...' allowClear/>
            <Radio.Group defaultValue='1' className='resources-tree__sort-type-group'>
                <Radio.Button value='1' className='resources-tree__sort-type-group__button'>By specialtiy</Radio.Button>
                <Radio.Button value='2' className='resources-tree__sort-type-group__button'>By alphabet</Radio.Button>
            </Radio.Group>
            <Tree checkable defaultExpandAll={true} defaultExpandParent={true} treeData={nodeProps}/>
        </Space>
    );
}