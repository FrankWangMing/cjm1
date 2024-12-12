import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from './store';

export default observer(() => {
  const { name, setName } = useStore();
  return (
    <>
      <h1>{name}</h1>
      <Button
        onClick={() => {
          setName('init');
        }}>
        重置
      </Button>
    </>
  );
});
