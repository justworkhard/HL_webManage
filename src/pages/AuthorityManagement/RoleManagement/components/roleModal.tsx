import { Select, Form, Row, Col, message, Input } from 'antd';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { addRole, updateRole, addUserGroup } from '@/services/autoManage'
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
        roleName: '',
        roleType: '',
    })


    function onClickSubmit() {
        let tempFun = modalType === 'add' ? addRole : updateRole
        tempFun(params).then(res => {
            if (res.code !== 1200) {
                message.error('添加失败！')
            }
            message.success('添加成功！')
            afterClick()
        })
    }

    useEffect(() => {
        if (modalData.id) {
            setParams(modalData)
        }
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
            {
                modalType == 'add' ? '' : (
                    <div>
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
                    </div>
                )
            }
            {
                modalType == 'add' ? (<Row >
                    <Col span={20}>
                        <Form.Item
                            label='角色名称'
                            name="id"
                        >
                            <Input placeholder='请输入角色名称' onChange={(event) => {
                                setParams({
                                    ...params,
                                    roleName: event?.target.value
                                })
                            }}></Input>
                        </Form.Item></Col>
                </Row>) : ''
            }
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='角色类型'
                        name="roleType"
                    >
                        <Input placeholder='请输入角色类型' onChange={(event) => {
                            setParams({
                                ...params,
                                roleType: event?.target.value
                            })
                        }}></Input>
                    </Form.Item></Col>
            </Row>
        </Form >
    )
}
App = forwardRef(App)
export default App