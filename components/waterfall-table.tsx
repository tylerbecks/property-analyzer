import { Table, Typography } from 'antd';
import { format } from 'date-fns';

import { BuyDataPoint } from '../utils/home-purchase-utils';
import { formatCurrency } from '../utils/text-formatter';

const { Title } = Typography;

interface Props {
  rows: BuyDataPoint[];
}

const WaterfallTable: React.FC<Props> = ({ rows }) => {
  const tableRows = rows.map((r, idx) => ({
    ...r,
    key: idx.toString(),
  }));

  const columns = [
    {
      dataIndex: 'date',
      title: 'Date',
      render: (date: Date) => format(date, 'MMM yyyy'),
    },
    {
      dataIndex: 'homeValue',
      title: 'Property Value',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'remainingMortgage',
      title: 'Remaining Mortgage',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'equity',
      title: 'Equity',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'principal',
      title: 'Principal',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'interestAmount',
      title: 'Interest',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'taxes',
      title: 'Taxes',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'insurance',
      title: 'Insurance',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'piti',
      title: 'PITI',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'operatingExpenses',
      title: 'Operating Expenses',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'netRentalIncome',
      title: 'Net Rental Income',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'cashFlow',
      title: 'Cash Flow',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'interestDeduction',
      title: 'Interest Tax Deduction',
      render: (price: number) => formatCurrency(price),
    },
    {
      dataIndex: 'netWorth',
      title: 'Net Worth',
      render: (price: number) => formatCurrency(price),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableRows}
      pagination={{ pageSize: 60 }}
      title={() => <Title level={4}>Buy Rows</Title>}
    />
  );
};

export default WaterfallTable;
