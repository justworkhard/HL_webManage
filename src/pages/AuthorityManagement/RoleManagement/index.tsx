import { Modal, Table, Popconfirm, Space, Button, Card, Col, DatePicker, Form, Input, Row, message } from 'antd';
import React, { FC, useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, useModel } from 'umi';
import { seachRoleList, dleteRole } from '@/services/autoManage'
import styles from './style.less';
import UserModal from './components/roleModal'
import GroupModal from './components/bindModal'
import { SmileOutlined } from '@ant-design/icons';

const UserManagement: FC<any> = ({
  submitting,
}) => {
  
  const { initialState, setInitialState } = useModel('@@initialState');

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
    code: undefined,
    startTime: undefined,
    endTime: undefined,
    name: undefined,
    type: undefined,
  })
  const [visible, setVisible] = useState(false)
  const [visibleG, setVisibleG] = useState(false)
  const [tableData, setTableData] = useState([])
  const [dataTotal, setDataTotal] = useState(0)
  const userModalRef = useRef<any>(null);//取到的值就可以用了
  const groupModalRef = useRef<any>(null)

  function getData(pageNo?: number) {

    seachRoleList({
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
      title: '角色编号',
      dataIndex: 'roleCode',
      width: 80,
      key: 'roleCode',
    },
    {
      title: '角色名称',
      width: 80,
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '添加时间',
      dataIndex: 'createAt',
      width: 80,
      key: 'createAt',
    },
    {
      title: '角色类型',
      width: 80,
      dataIndex: 'roleType',
      key: 'roleType',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      key: 'action',
      render: (record: any) => (
        <Space size="middle">
          <Button type='default' onClick={() => {
            setVisible(true)
            setModalType('read')
            setModalData(record)
          }}>更改</Button>
          <Button type='primary' onClick={() => {
            setModalData(record)
            setVisibleG(true)
          }}>关联菜单</Button>
          <Popconfirm placement="top" title={'是否删除？'} onConfirm={() => {
            dleteRole({ id: record.id }).then(res => {
              if (res.code != 1200) {
                message.error('删除失败')
              } else {
                message.success('删除成功')
                getData()
              }
            })
          }} okText="是" cancelText="否">
            <Button type='primary' danger >删除</Button>
          </Popconfirm>
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
                label='角色编号'
                name="code"
              >
                <Input placeholder="请输入角色编号" onChange={(event) => {
                  setParams({
                    ...params,
                    code: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='添加时间'
                name="url"
              >
                {/* <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} onChange={(event, str) => {
                  setParams({
                    ...params,
                    startTime: str[0],
                    endTime: str[1],
                  })
                }} /> */}
                <Space>
                  <DatePicker onChange={(event, str) => {
                    setParams({
                      ...params,
                      startTime: str,
                    })
                  }} ></DatePicker>
                  <DatePicker onChange={(event, str) => {
                    setParams({
                      ...params,
                      endTime: str,
                    })
                  }} ></DatePicker>
                </Space>
              </Form.Item>
            </Col>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='角色名称'
                name="name"
              >
                <Input placeholder="请输入角色名称" onChange={(event) => {
                  setParams({
                    ...params,
                    name: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='角色类型'
                name="type"
              >
                <Input placeholder="请输入角色类型" onChange={(event) => {
                  setParams({
                    ...params,
                    type: event.target.value
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
                  {/* <Button type="primary" onClick={() => {
                    setParams({
                      ...params,
                      code: undefined,
                      startTime: undefined,
                      endTime: undefined,
                      name: undefined,
                      type: undefined,
                    })
                  }} loading={submitting}>
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
            title={modalType == 'add' ? '添加角色' : '修改角色'}
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
            title={'关联菜单'}
            width={1000}
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
