import { Select, Form, Row, Col, message, Input } from 'antd';
import React, { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { addGroup, updateGroup } from '@/services/autoManage'
const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
function App(props: any, ref: any) {
    const { afterClick, modalData, modalType, groupList } = props

    const [form] = Form.useForm();
    //设置暴露给父组件的值
    useImperativeHandle(ref, () => {
        return {
            form: form
        }
    });
    const [params, setParams] = useState({
        comments: '',
        groupName: '',
        parentGroupCode: ''
    })


    function onClickSubmit() {
        let tempFun = modalType === 'add' ? addGroup : updateGroup
        let temParams = modalType !== 'add' ? { comments: params.comments, id: modalData.id } : { groupName: params.groupName, comments: params.comments, parentGroupCode: params.parentGroupCode }
        tempFun(temParams).then(res => {
            if (res.code !== 1200) {
                message.error('操作失败！')
            }
            message.success('操作成功！')
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
                                    label='分组ID'
                                    name="roleCode"
                                >
                                    <p style={{ marginBottom: '0px' }}>{modalData.groupCode}</p>
                                </Form.Item></Col >
                        </Row >
                        <Row>
                            <Col span={20}>
                                <Form.Item
                                    label='分组名称'
                                    name="roleName"
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
                                    label='更改备注'
                                    name=""
                                >
                                    <Input placeholder='请输入更改备注' onChange={(event) => {
                                        setParams({
                                            ...params,
                                            comments: event?.target.value
                                        })
                                    }}></Input>
                                </Form.Item></Col>
                        </Row>
                    </div>
                )
            }
            {
                modalType == 'add' ? (
                    <div>
                        <Row >
                            <Col span={20}>
                                <Form.Item
                                    label='分组名称'
                                    name="groupName"
                                >
                                    <Input placeholder='请输入分组名称' onChange={(event) => {
                                        setParams({
                                            ...params,
                                            groupName: event?.target.value
                                        })
                                    }}></Input>
                                </Form.Item></Col>
                        </Row>
                        <Row >
                            <Col span={20}>
                                <Form.Item
                                    label='备注'
                                    name="comments"
                                >
                                    <Input placeholder='请输入备注' onChange={(event) => {
                                        setParams({
                                            ...params,
                                            comments: event?.target.value
                                        })
                                    }}></Input>
                                </Form.Item></Col>
                        </Row>
                        <Row >
                            <Col span={20}>
                                <Form.Item
                                    label='父类分组'
                                    name="parentGroupCode"
                                >
                                    <Select placeholder='请选择' onSelect={(value) => {
                                        setParams({
                                            ...params,
                                            parentGroupCode: value
                                        })
                                    }}>
                                        {
                                            groupList.map((item: any, index: any) => (
                                                <Option value={item.groupCode}>
                                                    {item.groupName}
                                                </Option>
                                            ))
                                        }

                                    </Select>
                                </Form.Item></Col>
                        </Row>
                    </div>
                ) : ''
            }

        </Form >
    )
}
App = forwardRef(App)
export default App