/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author jamie
 */
import Pdfh5 from 'pdfh5';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'umi';
import { modalList } from '../const';
const Wrapper = styled.div`
  .main {
    padding: 30rem 40rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    img {
      height: 600rem;
      margin-bottom: 20rem;
    }
    .detailText {
      text-indent: 2em;
    }
    .imgListItem {
      width: 100%;
      height: auto;
      object-fit: cover; /* 根据需要设置 */
    }
  }
`;

const Component = observer(() => {
  const location = useLocation();
  const id = location.state;
  const detailObj = modalList[id.id];
  // useEffect(() => {
  //   console.log('id', id);
  //   console.log('list', modalList);
  // }, []);
  return (
    <Wrapper>
      <div className="main">
        <h2>{detailObj.title}</h2>
        <img src={detailObj.detailImg}></img>
        <h3>{detailObj.dec}</h3>
        {detailObj.detail.map(index => (
          <div className="detailText">{index}</div>
        ))}
        <img src={detailObj.imgList} className="imgListItem"></img>
      </div>
    </Wrapper>
  );
});
export default function Modal() {
  return <Component />;
}
