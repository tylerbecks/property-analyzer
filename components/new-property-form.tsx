/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Form, Input, InputNumber, Typography } from 'antd';

import { Property } from '../types/property';
import { formatCurrency } from '../utils/text-formatter';

const { Title } = Typography;
const TYPE_VALIDATION_TEMPLATE = "'${label}' is not a valid ${type}";
const LABEL_SPAN = 4;

const layout = {
  labelCol: { span: LABEL_SPAN },
  wrapperCol: { span: 16 },
};
const inputNumberCss = css`
  width: 100%;
`;
const button = css`
  margin-right: 8px;
`;

interface Props {
  onSubmit: (Property: Property) => void;
}

const PropertyForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onAddressChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    form.setFieldsValue({
      name: value,
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (Property: Property) => {
    onSubmit(Property);
    form.resetFields();
  };

  const validateMessages = {
    required: "'${label}' is required!",
    types: {
      string: TYPE_VALIDATION_TEMPLATE,
      method: TYPE_VALIDATION_TEMPLATE,
      array: TYPE_VALIDATION_TEMPLATE,
      object: TYPE_VALIDATION_TEMPLATE,
      number: TYPE_VALIDATION_TEMPLATE,
      date: TYPE_VALIDATION_TEMPLATE,
      boolean: TYPE_VALIDATION_TEMPLATE,
      integer: TYPE_VALIDATION_TEMPLATE,
      float: TYPE_VALIDATION_TEMPLATE,
      regexp: TYPE_VALIDATION_TEMPLATE,
      email: TYPE_VALIDATION_TEMPLATE,
      url: TYPE_VALIDATION_TEMPLATE,
      hex: TYPE_VALIDATION_TEMPLATE,
    },
  };

  return (
    <Form
      {...layout}
      form={form}
      name="new-property"
      onFinish={onFinish}
      colon={false}
      validateMessages={validateMessages}
    >
      <Title level={3}>Add new property</Title>
      <Form.Item name="address_1" label="Street Address 1" rules={[{ required: true }]}>
        <Input allowClear onChange={onAddressChange} />
      </Form.Item>

      <Form.Item name="address_2" label="Street Address 2">
        <Input allowClear />
      </Form.Item>

      <Form.Item name="city" label="City" rules={[{ required: true }]}>
        <Input allowClear />
      </Form.Item>

      <Form.Item name="state" label="State / Province" rules={[{ required: true }]}>
        <Input allowClear />
      </Form.Item>

      <Form.Item
        name="zip"
        label="Postal / Zip Code"
        rules={[{ required: true, pattern: /^\d{5}(?:[-\s]\d{4})?$/ }]} // https://stackoverflow.com/questions/2577236/regex-for-zip-code
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item
        name="country"
        label="Country"
        rules={[{ required: true }]}
        initialValue="United States"
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true }]}
        tooltip="This is the display name to identify the property.  It is set to the address by default.  This can be changed later."
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="size"
        label="Size (sqft)"
        rules={[{ type: 'number', min: 1, required: true }]}
      >
        <InputNumber css={inputNumberCss} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Asking Price"
        rules={[{ type: 'number', min: 1, required: true }]}
      >
        <InputNumber
          css={inputNumberCss}
          formatter={(value) => formatCurrency(String(value))}
          parser={(value: string | undefined) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
        />
      </Form.Item>

      <Form.Item name="type" label="Type" tooltip="e.g. Single Family, Multifamily, Condo, etc">
        <Input allowClear />
      </Form.Item>

      <Form.Item
        name="url"
        label="URL"
        rules={[
          {
            type: 'url',
            message:
              'Please provide a full URL.  GOOD: https://www.google.com/  BAD: www.google.com',
          },
        ]}
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: LABEL_SPAN }}>
        <Button type="primary" htmlType="submit" css={button}>
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PropertyForm;
