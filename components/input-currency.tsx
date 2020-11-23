import { InputNumber } from 'antd';
import React from 'react';

import { formatCurrency } from '../utils/text-formatter';

interface Props {
  [x: string]: unknown;
}

const InputCurrency = React.forwardRef<HTMLInputElement, Props>((props, ref) => (
  <InputNumber
    {...props}
    ref={ref}
    formatter={(value) => formatCurrency(String(value))}
    parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
  />
));

InputCurrency.displayName = 'InputCurrency';

export default InputCurrency;
