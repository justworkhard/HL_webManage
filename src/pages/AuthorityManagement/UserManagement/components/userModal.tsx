import { Col, Form, Input, message, Row, Select } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { registerUser, updateUser } from '@/services/autoManage'
const { Option } = Select

function App(props: any, ref: any) {
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    };
    const [form] = Form.useForm();

    //设置暴露给父组件的值
    useImperativeHandle(ref, () => {
        return {
            params: params,
            form: form
        }
    });
    const { modalType, modalData, afterClick } = props
    const [params, setParams] = useState({})

    function onClickSubmit() {
        let tempFun = modalType == 'add' ? registerUser : updateUser
        let successStr = modalType == 'add' ? '添加成功' : '修改成功！'
        tempFun(params).then(res => {
            if (res.code !== 1200) {
                message.error('操作失败！')
            }
            message.success(successStr)
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
                modalType !== 'add' ? (
                    <Row>
                        <Col span={20}>
                            <Form.Item
                                label='用户ID'
                                name="id"
                            >
                                <p>{modalData.id}</p>
                            </Form.Item></Col>
                    </Row>
                ) : ''
            }
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='账号'
                        name="account"
                        rules={[{ required: true, message: '必填项!' }]}
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入账号" onChange={(event) => {
                            setParams({
                                ...params,
                                account: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            {
                modalType == 'add' ? (
                    <Row>
                        <Col span={20}>
                            <Form.Item
                                label='密码'
                                rules={[{ required: true, message: '必填项!' }]}
                                name="password"
                            >
                                <Input.Password disabled={modalType == 'read' ? true : false} placeholder="请输入电话" onChange={(event) => {
                                    setParams({
                                        ...params,
                                        password: event.target.value
                                    })
                                }} />
                            </Form.Item></Col>
                    </Row>
                ) : ''
            }
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='电话'
                        rules={[{ required: true, message: '必填项!' }]}
                        name="tel"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入电话" onChange={(event) => {
                            setParams({
                                ...params,
                                tel: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='邮箱'
                        name="mail"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入邮箱" onChange={(event) => {
                            setParams({
                                ...params,
                                mail: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='昵称'
                        name="nickName"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入昵称" onChange={(event) => {
                            setParams({
                                ...params,
                                nickName: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='真实姓名'
                        name="realName"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入真实姓名" onChange={(event) => {
                            setParams({
                                ...params,
                                realName: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='性别'
                        rules={[{ required: true, message: '必填项!' }]}
                        name="gender"
                    >
                        <Select placeholder='请选择' onSelect={(value: string) => {
                            setParams({
                                ...params,
                                gender: value
                            })
                        }} disabled={modalType == 'read' ? true : false}>
                            <Option value='男'>男</Option>
                            <Option value='女'>女</Option>
                        </Select>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='年龄'
                        name="age"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入年龄" onChange={(event) => {
                            setParams({
                                ...params,
                                age: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='生日'
                        name="birthday"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入生日" onChange={(event) => {
                            setParams({
                                ...params,
                                birthday: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='婚姻状况'
                        name="marriage"
                    >
                        <Select placeholder='请选择' onSelect={(value: string) => {
                            setParams({
                                ...params,
                                marriage: value
                            })
                        }} disabled={modalType == 'read' ? true : false}>
                            <Option value='未婚'>未婚</Option>
                            <Option value='已婚'>已婚</Option>
                            <Option value='离异'>离异</Option>
                        </Select>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='职业'
                        name="job"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入职业" onChange={(event) => {
                            setParams({
                                ...params,
                                job: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='年收入'
                        name="annualIncome"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入年收入" onChange={(event) => {
                            setParams({
                                ...params,
                                annualIncome: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='汽车品牌'
                        name="carBrand"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入汽车品牌" onChange={(event) => {
                            setParams({
                                ...params,
                                carBrand: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='证件类型'
                        name="idCardType"
                    >
                        <Select placeholder='请选择' onSelect={(value: string) => {
                            setParams({
                                ...params,
                                idCardType: value
                            })
                        }} disabled={modalType == 'read' ? true : false}>
                            <Option value='身份证'>身份证</Option>
                            <Option value='护照'>护照</Option>
                            <Option value='港澳通行证'>港澳通行证</Option>
                        </Select>
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='证件号'
                        rules={[{ required: true, message: '必填项!' }]}
                        name="idCardNum"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入证件类型" onChange={(event) => {
                            setParams({
                                ...params,
                                idCardNum: event.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item
                        rules={[{ required: true, message: '必填项!' }]}
                        label='邮件地址'
                        name="mailAddress"
                    >
                        <Input disabled={modalType == 'read' ? true : false} placeholder="请输入邮件地址" onChange={(event) => {
                            setParams({
                                ...params,
                                mailAddress: event.target.value

                            })
                        }} />
                    </Form.Item></Col>
            </Row>
        </Form>
    )
}
App = forwardRef(App)
export default App