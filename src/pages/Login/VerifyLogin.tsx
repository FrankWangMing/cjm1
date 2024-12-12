import Loading from '@/components/Loading';

export default () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Loading loadingFlag={true} />
    </div>
  );
};
