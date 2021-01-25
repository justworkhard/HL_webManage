import { Select, Form, Row, Col, message } from 'antd';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { queryUserGroupList, userGroups, addUserGroup, deleteUserMapUserGroupDeleteMapUserGroup } from '@/services/autoManage'
const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
function App(props: any, ref: any) {
    const { afterClick, modalData } = props

    const [form] = Form.useForm();
    //设置暴露给父组件的值
    useImperativeHandle(ref, () => {
        return {
            form: form
        }
    });
    const [groupList, setGroupList] = useState([])
    const [params, setParams] = useState({
        groupCode: '',
        userId: modalData.id,
    })
    const [roleList, setRoleList] = useState([])


    function onClickSubmit() {
        addUserGroup(params).then(res => {
            if (res.code !== 1200) {
                message.error('绑定失败！')
            }
            message.success('绑定成功！')
            afterClick()
        })
    }
    function initData() {
        queryUserGroupList({ userId: modalData.id }).then(res => {
            setRoleList(res.data)
        })
        userGroups().then(res => {
            if (res.code != 1200) {
                return
            }
            setGroupList(res.data)
        })
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <Form
            form={form}
            {...layout}
            onFinish={onClickSubmit}
            onFinishFailed={() => {
                console.log('提交失败！');
            }}
        >
            <Row >
                <Col span={20}>
                    <Form.Item
                        label='用户ID'
                        name="id"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.id}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='登录账号'
                        name="url"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.account}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='真实姓名'
                        name="url"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.realName}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='昵称'
                        name="url"
                    >
                        <p style={{ marginBottom: '0px' }}>{modalData.nickName}</p>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='已关联分组'
                        name="url"
                    >
                        {
                            roleList.map((item: any, index) => {
                                return (
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <p>{index + 1}. </p>
                                        <p >{item.groupName}</p>
                                        <p style={{ color: '#409EFF', marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                deleteUserMapUserGroupDeleteMapUserGroup({
                                                    userId: modalData.id,
                                                    groupCode: item.groupCode
                                                }).then(res => {
                                                    if (res.code != 1200) {
                                                        message.error('解绑失败！请稍后重试！')
                                                    }
                                                    message.success('解绑成功！')
                                                    initData()
                                                })
                                            }}
                                        >解除绑定</p>
                                    </div>
                                )
                            })
                        }
                        {
                             roleList.length <= 0?(
                                   <p>暂无绑定</p>
                                ): ''
                        }
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='关联分组'
                        name="url"
                    >
                        <Select
                            placeholder="请选择"
                            onChange={(value: string) => {
                                setParams({
                                    ...params,
                                    groupCode: value
                                })
                            }}
                            allowClear
                        >
                            {
                                groupList.map((item: any) => {
                                    return (
                                        <Option value={item.groupCode}>{item.groupName}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item></Col>
            </Row>

        </Form >
    )
}
App = forwardRef(App)
export default App