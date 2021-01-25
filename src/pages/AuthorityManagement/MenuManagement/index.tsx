import { Modal, Table, Space, Button, Card, Col, Form, Input, Row, message } from 'antd';
import React, { FC, useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { getMenuList } from '@/services/autoManage'
import styles from './style.less';
import UserModal from './components/userModal'

const UserManagement: FC<any> = ({
}) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 20 },
  };
  const [form] = Form.useForm();
  const [modalData, setModalData] = useState({})
  const [params, setParams] = useState({
    pageSize: 10,
    pageNo: 1,
    name: undefined,
    code: undefined,
  })
  const [visible, setVisible] = useState(false)
  const [tableData, setTableData] = useState([])
  const [dataTotal, setDataTotal] = useState(0)
  const userModalRef = useRef<any>(null);//取到的值就可以用了

  function getData(pageNo?: number) {

    getMenuList({
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
      title: '菜单编号',
      dataIndex: 'menuCode',
      width: 100,
      key: 'menuCode',
    },
    {
      title: '菜单名称',
      width: 100,
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '菜单等级',
      width: 60,
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '父类菜单编码',
      dataIndex: 'parentMenuCode',
      width: 100,
      key: 'parentMenuCode',
    },
    {
      title: '菜单状态',
      width: 100,
      dataIndex: 'state',
      key: 'state',
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
            setModalData(record)
          }}>更改名称</Button>
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
                label='菜单编号'
                name="code"
              >
                <Input placeholder="请输入菜单编号" onChange={(event) => {
                  setParams({
                    ...params,
                    code: event.target.value
                  })
                }} />
              </Form.Item>
            </Col>
            <Col lg={7} md={14} sm={26}>
              <Form.Item
                label='菜单名称'
                name="name"
              >
                <Input placeholder="请输入菜单名称" onChange={(event) => {
                  setParams({
                    ...params,
                    name: event.target.value
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
                </Space>

              </Form.Item>
            </Col>
          </Row>
          <Table pagination={{ onChange: (page) => { getData(page) }, total: dataTotal }} scroll={{ x: 1500 }} columns={columns} dataSource={tableData} />
          <Modal
            destroyOnClose={true}
            visible={visible}
            title='修改菜单'
            onOk={async () => {
              console.log(userModalRef);
              await userModalRef.current.form.submit()
            }}
            onCancel={() => {
              setVisible(false)
            }}

          >
            <UserModal afterClick={() => {
              setVisible(false)
              getData()
            }} modalData={modalData} ref={userModalRef}></UserModal>
          </Modal>
        </Card>
      </PageContainer>
    </Form>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['authorityManagementAndRoleManagement/submitAdvancedForm'],
}))(UserManagement);
