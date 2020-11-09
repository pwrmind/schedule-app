
import React, { useState } from 'react'; 
import { Layout, Typography } from 'antd';
import { CustomRoute } from '../router/routes';

const { Header, Sider, Content } = Layout;

export default  (props: {routes?: CustomRoute[]}) => {
    const [siderIsCollapsed] = useState(false);
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={siderIsCollapsed}>
               <Typography.Title>
                   Side menu
               </Typography.Title>
            </Sider>
            <Layout>
                <Header>
                    <Typography.Title>Some header</Typography.Title>
                </Header>
                <Content>
                <Typography.Title>Some content</Typography.Title>
                </Content>
            </Layout>
        </Layout>
    );
}