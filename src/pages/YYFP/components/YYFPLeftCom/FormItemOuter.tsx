/**
 * form表单填充
 */
import { useSafeState } from 'ahooks';
import { ISelectOptions } from '../../const';
import { useEffect } from 'react';
import { Form, Radio } from 'antd';

interface FormItemOuterProp {
  title: string;
  name: string;
  options: ISelectOptions[];
  onChange?: Function;
  onClick?: Function;
}
const FormItemOuter = ({
  title,
  name,
  options,
  onChange,
  onClick
}: FormItemOuterProp) => {
  const [className, setClassName] = useSafeState<string>();
  useEffect(() => {
    if (options.length == 0) {
      return;
    }
    options.length == 1 && setClassName('one');
    options.length == 2 && setClassName('two');
    options.length == 3 && setClassName('three');
    options.length == 5 && setClassName('five');
  }, [options]);
  return (
    <div className="form-item-outer">
      <div className="form-item_title">{title}：</div>
      <div className="form-item_content">
        <Form.Item name={name}>
          <Radio.Group
            onFocus={() => {
              onClick && onClick();
            }}
            onChange={e => {
              onChange && onChange(e);
            }}>
            {options.map((item, index) => {
              return (
                <Radio.Button
                  key={index}
                  value={item.value}
                  className={className}>
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export { FormItemOuter };
