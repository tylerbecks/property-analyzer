/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Collapse, Typography } from 'antd';

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const container = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;
const titleCss = css`
  margin-bottom: 16px;
`;

interface Props {
  error: {
    message: string;
    stack?: string;
  };
}

const LoadingScreen: React.FC<Props> = ({ error }) => {
  console.log({ ...error });
  console.error(error);

  return (
    <main css={container}>
      <Title level={3} css={titleCss}>
        Oh no! There was an error{' '}
        <span role="img" aria-label="crying face">
          😢
        </span>
      </Title>

      <Collapse ghost>
        <Panel header="Error - nerds only 🤓" key="1">
          <Title level={4}>Error Message</Title>
          <Text code>{error.message}</Text>
          {error.stack && (
            <>
              <Title level={4}>Stack Trace</Title>
              <Paragraph>
                <pre>{error.stack}</pre>
              </Paragraph>
            </>
          )}
        </Panel>
      </Collapse>
    </main>
  );
};

export default LoadingScreen;
