import { InputNumber } from 'antd';

import { formatCurrency } from '../utils/text-formatter';

interface Props {
  [x: string]: unknown;
}

const InputCurrency: React.FC<Props> = (props) => (
  <InputNumber
    {...props}
    formatter={(value) => formatCurrency(String(value))}
    parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
  />
);
export default InputCurrency;
