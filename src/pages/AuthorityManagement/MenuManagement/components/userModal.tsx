import { Col, Form, Input, message, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { updateMenu } from '@/services/autoManage'

function App(props: any, ref: any) {
    let { modalData, afterClick } = props

    console.log(modalData);

    const [form] = Form.useForm();
    //设置暴露给父组件的值
    useImperativeHandle(ref, () => {
        return {
            form: form
        }
    });
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    };
    const [params, setParams] = useState({
        menuName: modalData.menu,
        id: modalData.id
    })

    return (
        <Form
            {...layout}
            initialValues={modalData}
            onFinish={() => {
                console.log('onFinish');
                updateMenu(params).then(res => {
                    if (res.code != 1200) {
                        message.error('修改菜单失败！')
                    }
                    message.success('修改菜单成功！')
                    afterClick()
                })
            }}
            form={form}
        >
            <Row>
                <Col span={20}>
                    <Form.Item
                        label='菜单名'
                        name="menuName"
                    >
                        <Input placeholder="请输入菜单名" onChange={(e) => {
                            setParams({
                                ...params,
                                menuName: e.target.value
                            })
                        }} />
                    </Form.Item></Col>
            </Row>
        </Form>
    )
}
App = forwardRef(App)
export default App