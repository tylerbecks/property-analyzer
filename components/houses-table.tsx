/* eslint-disable react/display-name */
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { gql, Reference, useMutation } from '@apollo/client';
import { Button, Form, Input, InputNumber, Table, Tooltip } from 'antd';
import { useState } from 'react';

import { PROPERTY_FRAGMENT } from '../fragments/property';
import { Property } from '../types/property';
import { formatCurrency } from '../utils/text-formatter';

export const UPDATE_HOUSE = gql`
  mutation UpdateHouse($id: Int!, $_fields: properties_set_input) {
    update_properties_by_pk(pk_columns: { id: $id }, _set: $_fields) {
      ...Property
    }
  }
  ${PROPERTY_FRAGMENT}
`;

export const DELETE_HOUSE = gql`
  mutation DeleteHouse($id: Int!) {
    delete_properties_by_pk(id: $id) {
      id
    }
  }
`;

interface TableRecord {
  key: string;
  name: string;
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

const toTableRows = (properties: Property[]): TableRecord[] =>
  properties.map((p, idx) => ({
    key: idx.toString(),
    name: p.name,
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
    actions: p.id,
  }));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  editable: true;
  title: string;
  inputType: 'number' | 'text';
  record: TableRecord;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputType === 'number' ? <InputNumber /> : <Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface Props {
  properties: Property[];
}

const HousesTable: React.FC<Props> = ({ properties }) => {
  const [updateHouse] = useMutation(UPDATE_HOUSE);
  const [deletePropertyMutation] = useMutation(DELETE_HOUSE);
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
      const newHouseData = {
        name: row.name,
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
            __typename: 'properties',
            ...newHouseData,
          },
        },
      });

      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const tableRows = toTableRows(properties);
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
                (propertyRef: Reference) => readField('id', propertyRef) !== deletedProperty.id
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
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      editable: false,
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
      editable: true,
      render: (price: number) => formatCurrency(String(price)),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      editable: true,
      render: (size: number) => size.toLocaleString(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      editable: true,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'actions',
      editable: false,
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
