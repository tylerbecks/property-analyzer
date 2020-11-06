/* eslint-disable react/display-name */
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { gql, Reference, useMutation } from '@apollo/client';
import { Button, Form, Input, InputNumber, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import { HOUSE_FRAGMENT } from '../fragments/house';
import { House } from '../types/house';
import { formatCurrency } from '../utils/text-formatter';

export const UPDATE_HOUSE = gql`
  mutation UpdateHouse($id: Int!, $_fields: houses_set_input) {
    update_houses_by_pk(pk_columns: { id: $id }, _set: $_fields) {
      ...House
    }
  }
  ${HOUSE_FRAGMENT}
`;

export const DELETE_HOUSE = gql`
  mutation DeleteHouse($id: Int!) {
    delete_houses_by_pk(id: $id) {
      id
    }
  }
`;

interface TableRecord {
  key: string;
  name: {
    name: string;
    id: number;
  };
  address: {
    address1: string;
    address2: string | undefined;
    city: string;
    state: string;
    zip: string;
  };
  price: number;
  size: number;
  type: string | undefined;
  notes: string | undefined;
  actions: number;
}

interface UpdateHouseData {
  name: string;
  type: string | undefined;
  price: number;
  size: number;
  notes: string | undefined;
}

const toTableRows = (houses: House[]): TableRecord[] =>
  houses.map((p, idx) => ({
    key: idx.toString(),
    name: {
      name: p.name,
      id: p.id,
    },
    address: {
      address1: p.address1,
      address2: p.address2,
      city: p.city,
      state: p.state,
      zip: p.zip,
    },
    price: p.price,
    size: p.size,
    type: p.type,
    notes: p.notes,
    actions: p.id,
  }));

interface Props {
  houses: House[];
}

const HousesTable: React.FC<Props> = ({ houses }) => {
  const [updateHouse] = useMutation(UPDATE_HOUSE);
  const [deleteHouseMutation] = useMutation(DELETE_HOUSE);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const edit = (record: TableRecord) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const isEditing = (record: TableRecord) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const saveChanges = async (houseId: number) => {
    try {
      const row = (await form.validateFields()) as TableRecord;
      const newHouseData: UpdateHouseData = {
        name: row.name.name,
        type: row.type,
        price: row.price,
        size: row.size,
        notes: row.notes,
      };

      updateHouse({
        variables: {
          id: houseId,
          _fields: newHouseData,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateComment: {
            id: houseId,
            __typename: 'houses',
            ...newHouseData,
          },
        },
      });

      setEditingKey('');
    } catch (errInfo) {
      console.warn('Validate Failed:', errInfo);
    }
  };

  const tableRows = toTableRows(houses);
  const handleDelete = (id: number) => {
    deleteHouseMutation({
      variables: { id },
      update: (cache, { data: { delete_houses_by_pk: deletedHouse } }) => {
        cache.modify({
          fields: {
            houses(existingHouseRefs = [], { readField }) {
              if (!deletedHouse) {
                return existingHouseRefs;
              }

              return existingHouseRefs.filter(
                (houseRef: Reference) => readField('id', houseRef) !== deletedHouse.id
              );
            },
          },
        });
      },
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      editable: true,
      required: true,
      title: 'Name',
      render: ({ id, name }: { id: number; name: string }) => (
        <Link href={`/houses/${id}`}>
          <a>{name}</a>
        </Link>
      ),
    },
    {
      dataIndex: 'address',
      editable: false,
      required: true,
      title: 'Address',
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
      dataIndex: 'price',
      editable: true,
      required: true,
      title: 'Price',
      render: (price: number) => formatCurrency(String(price)),
    },
    {
      dataIndex: 'size',
      editable: true,
      required: true,
      title: 'Size',
      render: (size: number) => size.toLocaleString(),
    },
    {
      dataIndex: 'type',
      editable: true,
      required: false,
      title: 'Type',
    },
    {
      dataIndex: 'notes',
      editable: true,
      required: false,
      title: 'Notes',
    },
    {
      dataIndex: 'actions',
      editable: false,
      title: '',
      render: (id: number, record: TableRecord) =>
        isEditing(record) ? (
          <span>
            <Button type="primary" onClick={() => saveChanges(id)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={() => cancel()}>Cancel</Button>
          </span>
        ) : (
          <>
            <Tooltip title="edit">
              <Button
                type="text"
                disabled={editingKey !== ''}
                shape="circle"
                onClick={() => edit(record)}
                icon={<EditOutlined style={{ fontSize: '18px' }} />}
              />
            </Tooltip>
            <Tooltip title="delete">
              <Button
                type="text"
                danger
                shape="circle"
                onClick={() => handleDelete(id)}
                icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
              />
            </Tooltip>
          </>
        ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: TableRecord) => ({
        record,
        inputType: ['size', 'price'].includes(col.dataIndex) ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergedColumns}
        dataSource={tableRows}
      />
    </Form>
  );
};

export default HousesTable;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  dataIndex: string;
  editable: true;
  editing: boolean;
  index: number;
  inputType: 'number' | 'text';
  record: TableRecord;
  required?: boolean;
  title: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  children,
  dataIndex,
  editing,
  inputType,
  required,
  title,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required, message: `Please Input ${title}!` }]}
        >
          {inputType === 'number' ? <InputNumber /> : <Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
