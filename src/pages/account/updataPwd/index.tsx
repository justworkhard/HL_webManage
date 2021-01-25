import { Modal, Table, Space, Button, Card, Col, DatePicker, Form, Row, Input, Upload, message } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { changePassword } from '@/services/login'
import { useModel } from 'umi';

const UserManagement: FC<any> = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };
  const [form] = Form.useForm();
  const [param, setParam] = useState({
    orgPassword: '',
    newPassword: '',
    pwdQuery: '',
    userId: currentUser?.adminId
  })

  function submit() {
    changePassword({
      ...param,
      token: currentUser.token
    }).then(res => {
      if (res.code == 1200) {
        message.success('修改成功')
      }else{
        message.success('修改失败！')
      }
    })
  }

  return (
    <Form
      {...layout}
      form={form}
      hideRequiredMark
      onFinish={submit}
    >
      <PageContainer >
        <Card>
          <Form.Item label='原始密码' rules={[{ required: true }]} name="orgPassword" >
            <Input.Password placeholder='原始密码' onChange={(event) => {
              setParam({
                ...param,
                orgPassword: event.target.value
              })
            }}></Input.Password>
          </Form.Item>
          <Form.Item label='新密码' rules={[{ required: true }]} name="newPassword">
            <Input.Password placeholder='新密码' onChange={(event) => {
              setParam({
                ...param,
                newPassword: event.target.value
              })
            }}></Input.Password>
          </Form.Item>
          <Form.Item label='确认密码' rules={[{ required: true }]} name="pwdQuery">
            <Input.Password placeholder='确认密码' onChange={(event) => {
              setParam({
                ...param,
                pwdQuery: event.target.value
              })
            }}></Input.Password>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              绑定
           </Button>
          </Form.Item>
        </Card>
      </PageContainer>
    </Form >
  );
};

export default UserManagement