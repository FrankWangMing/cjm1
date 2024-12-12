import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { useStore } from './store';
export default observer(() => {
  const { name, setName } = useStore();
  return (
    <Fragment>
      <> {name}</>
      <Button
        onClick={() => {
          setName('修改过的');
        }}>
        修改num
      </Button>
    </Fragment>
  );
});
