import { Select, Form, Tree, Popconfirm, Row, Col, message, Input } from 'antd';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { queryGroupRoleList, userRoles, addGroupRole, deleteUserMapGroupRoleDeleteMapGroupRole } from '@/services/autoManage'
const { Option } = Select;

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
        groupCode: modalData.groupCode,
        roleCode: '',
    })
    const [hadBindList, setHadBindList] = useState([])
    const [groupList, setGroupList] = useState([])

    function onClickSubmit() {
        addGroupRole(params).then(res => {
            if (res.code !== 1200) {
                message.error('绑定失败！')
            }
            message.success('绑定成功！')
            afterClick()
        })
    }

    function deleteBind(event: any) {
        deleteUserMapGroupRoleDeleteMapGroupRole({
            groupCode: modalData.groupCode,
            roleCode: event,
        }).then(res => {
            if (res.code != 1200) {
                return message.error('解绑失败！')
            }
            message.success('解绑成功！')
            queryGroupRoleList({
                groupCode: modalData.groupCode
            }).then(res => {
                let tempArray = res.data ? res.data : []
                setHadBindList(tempArray)
            })
        })
    }

    useEffect(() => {
        queryGroupRoleList({
            groupCode: modalData.groupCode
        }).then(res => {
            let tempArray = res.data ? res.data : []
            setHadBindList(tempArray)
        })
        userRoles().then(res => {
            setGroupList(res.data)
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
                        label='分组ID'
                        name="groupCode"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.groupCode}</p>
                    </Form.Item></Col >
            </Row >
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='分组名称'
                        name="groupName"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.groupName}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='备注'
                        name="comments"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.comments}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='已关联角色：'
                        name="roleType"
                    >
                        {

                            hadBindList.map((item, index) => (
                                <p style={{ marginBottom: '0px' }}>
                                    <span>{index + 1}.</span> {item.roleName}
                                    <span onClick={() => {
                                        deleteBind(item.roleCode)
                                    }} style={{ color: '#409EFF', cursor: "pointer", marginLeft: '10px' }}>解除绑定</span></p>
                            ))
                        }
                        {
                            hadBindList.length <= 0? (
                                <div>暂无绑定！</div>
                            ): ''
                        }
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='选择角色'
                        name="roleCode"
                    >
                        <Select placeholder='请输入' onSelect={(event) => {
                            setParams({
                                ...params,
                                roleCode: event
                            })
                        }}>
                            {
                                groupList.map((item, index) => (
                                    <Option value={item.roleCode}>
                                        {item.roleName}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item></Col>
            </Row>
        </Form >
    )
}
App = forwardRef(App)
export default App