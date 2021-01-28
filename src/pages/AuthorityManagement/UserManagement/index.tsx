import { Modal, Table, Space, Button, Card, Col, DatePicker, Form, Input, Row, message } from 'antd';
import React, { FC, useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { getAllUserList, registerUser, updateUser } from '@/services/autoManage'
import styles from './style.less';
import UserModal from './components/userModal'
import GroupModal from './components/groupModal'

const { RangePicker } = DatePicker;

const UserManagement: FC<any> = ({
  submitting,
}) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 20 },
  };
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState('')
  const [modalData, setModalData] = useState({})
  const [params, setParams] = useState({
    pageSize: 10,
    pageNo: 1,
    account: undefined,
    startTime: undefined,
    endTime: undefined,
    realName: undefined,
    nickName: undefined,
  })
  const [visible, setVisible] = useState(false)
  const [visibleG, setVisibleG] = useState(false)
  const [tableData, setTableData] = useState([])
  const [dataTotal, setDataTotal] = useState(0)
  const userModalRef = useRef<any>(null);//取到的值就可以用了
  const groupModalRef = useRef<any>(null)

  function getData(pageNo?: number) {

    getAllUserList({
      ...params,
      pageNo: pageNo || 1
    }
    ).then(res => {
      console.log(res);
      if (res.code !== 1200) {
        return message.error('请求失败！请重试!')
      }
      setTableData(res.data.records)
      setDataTotal(res.data.total)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const columns = [
    {
      title: '登录账号',
      dataIndex: 'account',
      width: 100,
      key: 'account',
    },
    {
      title: '真实姓名',
      width: 100,
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '用户性别',
      width: 60,
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '添加时间',
      dataIndex: 'createAt',
      width: 100,
      key: 'createAt',
    },
    {
      title: '昵称',
      width: 100,
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      key: 'action',
      render: (record: any) => (
        <Space size="middle">
          <Button type='default' onClick={() => {
            setVisible(true)
            setModalType('read')
            setModalData(record)
          }}>详情</Button>
          <Button type='primary' onClick={() => {
            setModalData(record)
            setVisible(true)
            setModalType('write')
          }}>修改</Button>
          <Button type='primary' onClick={() => {
            setModalData(record)
            setVisibleG(true)
          }}>关联分组</Button>
        </Space>
      ),
    },
  ];

  return (
    <Form
      {...layout}
      form={form}
      hideRequiredMark
      initialValues={{ members: tableData }}
    >
      <PageContainer >
        <Card className={styles.card} bordered={false}>
          <Row>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='登录账号'
                name="account"
              >
                <Input placeholder="请输入登录账号" onChange={(event) => {
                  setParams({
                    ...params,
                    account: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='添加时间'
                name="url"
              >
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} onChange={(event, str) => {
                  setParams({
                    ...params,
                    startTime: str[0],
                    endTime: str[1],
                  })
                }} />
              </Form.Item>
            </Col>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='用户名称'
                name="name"
              >
                <Input placeholder="请输入用户名称" onChange={(event) => {
                  setParams({
                    ...params,
                    realName: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='用户类型'
                name="name"
              >
                <Input placeholder="请输入用户类型" onChange={(event) => {
                  setParams({
                    ...params,
                    nickName: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24} md={24} sm={24}>
              <Form.Item
                style={{ marginLeft: '60px' }}
              >
                <Space>
                  <Button type="primary" onClick={() => {
                    getData()
                  }} >
                    检索
                </Button>
                  {/* <Button type="primary" onClick={() => setVisible(true)} loading={submitting}>
                    重置
                </Button> */}
                  <Button type="primary" onClick={() => { setModalType('add'), setModalData({}), setVisible(true) }} loading={submitting}>
                    添加用户
                 </Button>
                </Space>

              </Form.Item>
            </Col>
          </Row>
          <Table pagination={{ onChange: (page) => { getData(page) }, total: dataTotal }} scroll={{ x: 1500 }} columns={columns} dataSource={tableData} />
          <Modal
            destroyOnClose={true}
            visible={visible}
            title={modalType == 'read' ? '用户详情' : modalType == 'write' ? '修改用户' : '添加用户'}
            onOk={async () => {
              await userModalRef.current.form.submit()
            }}
            // confirmLoading={false}
            onCancel={() => {
              setVisible(false)
            }}

          >
            <UserModal afterClick={() => {
              setVisible(false)
              getData()
            }} ref={userModalRef} modalType={modalType} modalData={modalData}></UserModal>
          </Modal>
          <Modal
            visible={visibleG}
            destroyOnClose={true}
            title={'关联分组'}
            onOk={() => {
              groupModalRef.current.form.submit()
            }}
            onCancel={() => {
              setVisibleG(false)
            }}>
            <GroupModal afterClick={() => {
              setVisibleG(false)
            }} modalType={modalType} modalData={modalData} ref={groupModalRef}></GroupModal>
          </Modal>
        </Card>
      </PageContainer>
    </Form>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['authorityManagementAndRoleManagement/submitAdvancedForm'],
}))(UserManagement);
