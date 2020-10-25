/* eslint-disable react/display-name */
/** @jsx jsx */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { gql, Reference, useMutation, useQuery } from '@apollo/client';
import { css, jsx } from '@emotion/core';
import { Button, Table, Tooltip } from 'antd';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

// import QuickAddButton from '../components/_convenience/quick-add-property';
import LoadingScreen from '../components/loading-screen';
import { PROPERTY_FRAGMENT } from '../fragments/property';
import { Property } from '../types/property';
import { formatCurrency } from '../utils/text-formatter';

const newPropertyButton = css`
  margin-bottom: 18px;
  float: right;
`;

export const GET_PROPERTIES = gql`
  query GetProperties($userId: String!) {
    properties(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      ...PROPERTY
    }
  }
  ${PROPERTY_FRAGMENT}
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: Int!) {
    delete_properties_by_pk(id: $id) {
      id
    }
  }
`;

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
    delete: p.id,
  }));

const IndexPage: React.FC = () => {
  const [session] = useSession();
  const { loading, error, data } = useQuery(GET_PROPERTIES, {
    variables: { userId: session.user.id },
  });
  const [deletePropertyMutation] = useMutation(DELETE_PROPERTY);

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error :(</p>;

  const tableRows = toTableRows(data.properties);
  const handleDelete = (id: number) => {
    deletePropertyMutation({
      variables: { id },
      update: (cache, { data: { delete_properties_by_pk: deletedProperty } }) => {
        cache.modify({
          fields: {
            properties(existingPropertyRefs = [], { readField }) {
              if (!deletedProperty) {
                return existingPropertyRefs;
              }

              return existingPropertyRefs.filter(
                (propertyRef: Reference) => readField('id', propertyRef) !== deletedProperty.id // TODO add Type for propertyRef
              );
            },
          },
        });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      // eslint-disable-next-line react/display-name
      render: ({ name, url }: { name: string; url: string }) =>
        url ? <a href={url}>{name}</a> : name,
    },
    {
      title: 'Address',
      dataIndex: 'address',
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
      render: (price: number) => formatCurrency(String(price)),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (size: number) => size.toLocaleString(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
    {
      title: '',
      dataIndex: 'delete',
      render: (id: number) => (
        <Tooltip title="delete">
          <Button
            type="text"
            danger
            shape="circle"
            onClick={() => handleDelete(id)}
            icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {/* <QuickAddButton /> */}

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

export default IndexPage;
