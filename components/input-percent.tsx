import { InputNumber } from 'antd';
import React from 'react';

interface Props {
  [x: string]: unknown;
}

const InputPercent = React.forwardRef<HTMLInputElement, Props>((props, ref) => (
  <InputNumber
    {...props}
    ref={ref}
    formatter={(value) => `${value}%`}
    parser={(value: string | undefined) => (value ? value.replace('%', '') : '')}
  />
));

InputPercent.displayName = 'InputPercent';
export default InputPercent;
