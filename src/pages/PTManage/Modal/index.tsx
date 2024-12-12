/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author jamie
 */
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Card } from 'antd';
const { Meta } = Card;
import React from 'react';
import { modalList } from './const';
import { history } from 'umi';
const Wrapper = styled.div`
  .cardGroup {
    width: 100%;
    padding: 20rem 30rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .ant-card {
      box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 1px;
      border-radius: 10rem;
    }
    .ant-card-cover {
      border-radius: 10rem;
      height: 300rem;
      padding: 20rem;
    }
    .ant-card-meta-title {
      text-align: center;
      font-size: 24rem;
      margin-bottom: 20rem;
    }
    .ant-card-meta-description {
      font-size: 16rem;
    }
    .ant-card-meta {
      width: 100%;
    }
  }
`;
interface cardItemType {
  title: string;
  dec: string;
  img: string;
  pdfUrl: string;
}
const Component = observer(() => {
  return (
    <Wrapper>
      <div className="cardGroup">
        {modalList.map((item, index) => (
          <Card
            hoverable
            style={{ width: 400 + 'rem', height: 460 + 'rem' }}
            cover={<img alt="modalImg" src={item.img} />}
            onClick={() => {
              history.push('/ptmanage/modal/modalDetail', {
                id: index
              });
            }}>
            <Meta title={item.title} description={item.dec} />
          </Card>
        ))}
      </div>
    </Wrapper>
  );
});
export default function Modal() {
  return <Component />;
}
