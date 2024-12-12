import { useSafeState, useUpdateEffect } from 'ahooks';
import { Fragment, useEffect } from 'react';
import Loading from '../Loading';
import { CloseOutlined } from '@ant-design/icons';
interface ICenterModalCom {
  keys?: number;
  TitleDesc?: JSX.Element | null;
  TitleRightOpt: JSX.Element | null;
  ContentDiv: JSX.Element;
  open: string | number | undefined | null;
  size: 'large' | 'small' | 'middle';
  closeModal: Function;
  loading?: boolean;
  style?: any;
  type?: string;
}

/**
 * 中间弹窗组件
 * @returns
 */
const CenterModalCom: React.FC<ICenterModalCom> = ({
  keys,
  TitleDesc,
  TitleRightOpt,
  ContentDiv,
  open,
  size,
  closeModal,
  loading = false,
  style = {},
  type
}) => {
  const [modalOpen, setModalOpen] = useSafeState<
    undefined | number | string | null
  >();

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  return (
    <Fragment>
      {modalOpen && (
        <div
          style={style}
          className={[
            'center-outer',
            size === 'large'
              ? 'center-outer-modal_large'
              : size === 'middle'
              ? 'center-outer-modal_middle'
              : 'center-outer-modal_small'
          ].join(' ')}>
          <Fragment>
            {TitleDesc && (
              <div className="center-modal-header">
                {TitleDesc}
                {!loading && (
                  <div className="flex-center">
                    {TitleRightOpt}
                    <CloseOutlined
                      onClick={() => {
                        closeModal();
                      }}
                      alt="关闭"
                    />
                  </div>
                )}
                <div className="border-bottom-line"></div>
              </div>
            )}
            <div className="center-modal-content">
              {loading ? (
                <Loading loadingFlag={loading} color="#fff" />
              ) : (
                ContentDiv
              )}
            </div>
          </Fragment>
        </div>
      )}
    </Fragment>
  );
};
export { CenterModalCom };
