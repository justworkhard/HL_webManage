import { Select, Form, Tree, Popconfirm, Row, Col, message, Input } from 'antd';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { queryRoleMenuList } from '@/services/autoManage'
const { Option } = Select;
import { userMenu, addRoleMenuList } from '@/services/autoManage'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
function App(props: any, ref: any) {
    const { afterClick, modalData, modalType } = props

    const [form] = Form.useForm();
    //设置暴露给父组件的值
    useImperativeHandle(ref, () => {
        return {
            form: form
        }
    });
    const [params, setParams] = useState({
        menuCodeList: [],
        roleCode: modalData.roleCode,
    })
    const [treeData, setTreeData] = useState([])
    const [checkedKeys, setCheckedKeys] = useState([])

    function filterMenu(menuList: any) {
        let result: any = []
        menuList.forEach((item: any) => {
            let menuItem: any = {}
            menuItem.title = item.menuName
            menuItem.key = item.menuCode
            if (item.children.length > 0) {
                menuItem.children = filterMenu(item.children)
            }
            result.push(menuItem)
        })
        return result
    }
    function onClickSubmit() {
        addRoleMenuList(params).then(res => {
            if (res.code !== 1200) {
                message.error('绑定失败！')
            }
            message.success('绑定成功！')
            afterClick()
        })
    }

    useEffect(() => {
        queryRoleMenuList({
            roleCode: modalData.roleCode
        }).then(res => {
            let data = res.data || []
            let temp = []
            data.forEach((item: any) => {
                temp.push(item.menuCode)
            })
            setCheckedKeys(temp)
        })
        userMenu().then(res => {
            let menu = filterMenu(res.data)
            setTreeData(menu)
        })
    }, [])

    return (
        <Form
            form={form}
            {...layout}
            initialValues={modalData}
            onFinish={onClickSubmit}
            onFinishFailed={() => {
                console.log('提交失败！');
            }}
        >

            <Row >
                <Col span={20}>
                    <Form.Item
                        label='角色编号'
                        name="roleCode"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.roleCode}</p>
                    </Form.Item></Col >
            </Row >
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='角色名称'
                        name="roleName"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.roleName}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='原角色类型'
                        name="roleType"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.roleType}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='关联菜单'
                        name="roleType"
                    >
                        <Tree
                            checkable
                            onExpand={() => { }}
                            // expandedKeys={expandedKeys}
                            // autoExpandParent={autoExpandParent}
                            onCheck={(checkedKeys) => {
                                setParams({
                                    ...params,
                                    menuCodeList: checkedKeys
                                })
                                setCheckedKeys(checkedKeys)
                            }}
                            checkedKeys={checkedKeys}
                            onSelect={(selectedKeys, info) => {
                            }}
                            // selectedKeys={()=>{}}
                            treeData={treeData}
                        />
                    </Form.Item></Col>
            </Row>
        </Form >
    )
}
App = forwardRef(App)
export default App