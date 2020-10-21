/** @jsx jsx */
import { PlusOutlined } from '@ant-design/icons';
import { gql, useQuery } from '@apollo/client';
import { css, jsx } from '@emotion/core';
import { Button, Table } from 'antd';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

import LoadingScreen from '../components/loading-screen';
import { Property } from '../types/property';
import { formatCurrency } from '../utils/text-formatter';

const newPropertyButton = css`
  margin-bottom: 18px;
  float: right;
`;

export const GET_PROPERTIES = gql`
  query GetProperties($user_id: String!) {
    properties(where: { user_id: { _eq: $user_id } }) {
      address_1
      address_2
      city
      country
      name
      notes
      price
      size
      state
      type
      url
      zip
    }
  }
`;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // eslint-disable-next-line react/display-name
    render: ({ name, url }: { name: string; url: string }) =>
      url ? <a href={url}>{name}</a> : name,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    // eslint-disable-next-line react/display-name
    render: ({
      address1,
      address2,
      city,
      state,
      zip,
    }: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zip: string;
    }) => (
      <>
        <div>{address1}</div>
        {address2 && <div>{address2}</div>}
        <div>{`${city}, ${state}, ${zip}`}</div>
      </>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => formatCurrency(String(price)),
  },
  {
    title: 'Size',
    key: 'size',
    dataIndex: 'size',
    render: (size: number) => size.toLocaleString(),
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
  },
  {
    title: 'Notes',
    key: 'notes',
    dataIndex: 'notes',
  },
];

const toTableRows = (properties: Property[]) =>
  properties.map((p, idx) => ({
    key: idx,
    name: {
      name: p.name,
      url: p.url,
    },
    address: {
      address1: p.address_1,
      address2: p.address_2,
      city: p.city,
      state: p.state,
      zip: p.zip,
    },
    price: p.price,
    size: p.size,
    type: p.type,
    notes: p.notes,
  }));

const Properties: React.FC = () => {
  const [session] = useSession();

  const { loading, error, data } = useQuery(GET_PROPERTIES, {
    variables: { user_id: session.user.id },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error :(</p>;

  const tableRows = toTableRows(data.properties);

  return (
    <div>
      <Link href="/form">
        <a>
          <Button type="primary" css={newPropertyButton}>
            <PlusOutlined /> Property
          </Button>
        </a>
      </Link>
      <Table columns={columns} dataSource={tableRows} />
    </div>
  );
};

export default Properties;
