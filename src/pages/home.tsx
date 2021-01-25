import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl } from 'umi';
import styles from './welcome.less';


export default (): React.ReactNode => {
  const intl = useIntl();
  return (
    <PageContainer>
      <div className={styles.imgBox}>
        <Card>
          <h1>欢迎使用</h1>
        </Card>

      </div>
    </PageContainer>
  );
};