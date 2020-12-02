import { CalendarOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { format } from 'date-fns';

import { BuyDataPoint } from '../utils/home-purchase-utils';

const { Title, Paragraph } = Typography;

interface Props {
  buyRows: BuyDataPoint[];
}

const CashflowPositiveDate: React.FC<Props> = ({ buyRows }) => {
  const firstPositiveRow = buyRows.find((r) => r.cashFlow > 0);

  if (!firstPositiveRow) {
    return <p>This property will never cashflow</p>;
  }

  const formattedDate = format(firstPositiveRow.date, 'MMM yyyy');

  return (
    <div>
      <Title level={5}>Cashflow Positive Date</Title>
      <Paragraph>
        <CalendarOutlined /> {formattedDate}
      </Paragraph>
    </div>
  );
};

export default CashflowPositiveDate;
