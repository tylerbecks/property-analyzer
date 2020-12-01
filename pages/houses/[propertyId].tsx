/** @jsx jsx */
import { gql, StoreObject, useMutation, useQuery } from '@apollo/client';
import { css, jsx } from '@emotion/core';
import { Col, Collapse, Form, Row, Statistic, Typography } from 'antd';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import BuyVsRentChart from '../../components/buy-vs-rent-chart';
import ErrorScreen from '../../components/error-screen';
import InputCurrency from '../../components/input-currency';
import InputPercent from '../../components/input-percent';
import LoadingScreen from '../../components/loading-screen';
import withUserAndApollo from '../../components/with-user-and-apollo';
import { HOUSE_FRAGMENT } from '../../fragments/house';
import { House } from '../../types/house';
import { round } from '../../utils/num-helpers';
import { formatCurrency } from '../../utils/text-formatter';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const inputNumberCss = css`
  width: 50%;
`;

const getVacancyAmount = (rentalIncome: number | undefined, vacancyRate = 0) => {
  if (!rentalIncome) {
    return 0;
  }

  const vacancyAmount = rentalIncome * (vacancyRate / 100);
  return round(vacancyAmount);
};

export const getNetMonthlyRevenue = (rentalIncome: number | undefined, vacancyRate = 0): number => {
  if (!rentalIncome) return 0;

  const vacancyAmount = getVacancyAmount(rentalIncome, vacancyRate);
  return rentalIncome - vacancyAmount;
};

export const HousePage: React.FC = () => {
  const router = useRouter();
  const { propertyId } = router.query;
  const [session] = useSession();
  const { loading, error, data } = useQuery(GET_HOUSE_BY_ID, {
    variables: {
      id: propertyId,
    },
  });

  const [updateHouse] = useMutation(UPDATE_HOUSE);
  const [addHouseAssumptions] = useMutation(ADD_HOUSE_ASSUMPTIONS);
  const [updateHouseAssumptions] = useMutation(UPDATE_HOUSE_ASSUMPTIONS);

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  const { houses_by_pk: house }: { houses_by_pk: FullHouse } = data;

  const withNumVal = (func: (key: string, value: number) => void) => {
    return (key: string, value: string) => {
      const valueNum = Number(value);
      if (Number.isNaN(valueNum)) {
        return;
      }

      func(key, valueNum);
    };
  };

  const changeHouse = (key: string, value: unknown) => {
    updateHouse({
      variables: { _set: { [key]: value }, id: propertyId },
      optimisticResponse: {
        __typename: 'Mutation',
        update_houses_by_pk: {
          ...house,
          [key]: value,
        },
      },
    });
  };

  const changeAssumption = (key: string, value: number) => {
    if (house.assumption) {
      updateHouseAssumptions({
        variables: {
          _set: { [key]: value },
          id: house.assumption.id,
        },
        update: (cache, { data: { update_assumptions_by_pk: newAssumptionObj } }) => {
          cache.modify({
            id: cache.identify((house as unknown) as StoreObject),
            fields: {
              assumption() {
                const newAssumptionRef = cache.writeFragment({
                  data: newAssumptionObj,
                  fragment: gql`
                    fragment NewAssumption on assumptions {
                      ...Assumption
                    }
                    ${ASSUMPTION_FRAGMENT}
                  `,
                  fragmentName: 'NewAssumption',
                });

                return newAssumptionRef;
              },
            },
          });
        },
      });
    } else {
      addHouseAssumptions({
        variables: { assumptions: { userId: session.user.id, houseId: house.id, [key]: value } },
        update: (cache, { data: { insert_assumptions_one: newAssumptionObj } }) => {
          cache.modify({
            id: cache.identify((house as unknown) as StoreObject),
            fields: {
              assumption() {
                const newAssumptionRef = cache.writeFragment({
                  data: newAssumptionObj,
                  fragment: gql`
                    fragment NewAssumption on assumptions {
                      ...Assumption
                    }
                    ${ASSUMPTION_FRAGMENT}
                  `,
                  fragmentName: 'NewAssumption',
                });

                return newAssumptionRef;
              },
            },
          });
        },
      });
    }
  };

  const monthlyTaxesAmount = house.assumption?.tax
    ? (house.price * (house.assumption.tax / 100)) / 12
    : 0;
  const monthlyOperatingCosts = getSum([
    monthlyTaxesAmount,
    house.assumption?.propertyInsurance,
    house.assumption?.management,
    house.assumption?.maintenance,
    house.assumption?.utilities,
    house.assumption?.hoa,
  ]);
  const netMonthlyRevenue = getNetMonthlyRevenue(house.rentalIncome, house.assumption?.vacancy);
  const netMonthlyOperatingIncome = netMonthlyRevenue - monthlyOperatingCosts;
  const netOperatingIncome = netMonthlyOperatingIncome * 12;

  const capRate =
    house.rentalIncome && house.price > 0 ? (netOperatingIncome / house.price) * 100 : null;
  const downPayment = ((house.assumption?.downPercent || 0) / 100) * house.price;

  return (
    <Row>
      <Col span={12}>
        <Title level={2}>{house.name}</Title>
        <Paragraph>
          <div>
            <Text>{house.address1}</Text>
          </div>
          {house.address2 && (
            <div>
              <Text>{house.address2}</Text>
            </div>
          )}
          <div>
            <Text>{`${house.city}, ${house.state} ${house.zip}`}</Text>
          </div>
        </Paragraph>

        <Form layout="vertical">
          <Form.Item
            name="price"
            label="Purchase Price"
            rules={[{ type: 'number', min: 1 }]}
            initialValue={house.price}
          >
            <InputCurrency
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeHouse)('price', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="rentalIncome"
            label="Monthly Rental Income"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.rentalIncome}
          >
            <InputCurrency
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeHouse)('rentalIncome', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="vacancy"
            label="Vacancy Rate"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.assumption?.vacancy || 0}
            help={
              <VacancyHelp vacancy={house.assumption?.vacancy} rentalIncome={house.rentalIncome} />
            }
          >
            <InputPercent
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeAssumption)('vacancy', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="downPercent"
            label="Down Payment"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.assumption?.downPercent || 0}
            help={
              house.assumption?.downPercent &&
              formatCurrency(house.price * (house.assumption.downPercent / 100))
            }
          >
            <InputPercent
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeAssumption)('downPercent', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="closing"
            label="Closing Costs"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.assumption?.closing || 0}
          >
            <InputCurrency
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeAssumption)('closing', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="appreciation"
            label="Appreciation Rate"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.assumption?.appreciation || 0}
          >
            <InputPercent
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeAssumption)('appreciation', value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="inflation"
            label="Inflation Rate"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.assumption?.inflation || 0}
          >
            <InputPercent
              css={inputNumberCss}
              onChange={(value: string) => {
                withNumVal(changeAssumption)('inflation', value);
              }}
            />
          </Form.Item>

          <Collapse ghost>
            <Panel
              header={`Monthly Operating Expenses: ${formatCurrency(monthlyOperatingCosts)}`}
              key="1"
            >
              <Form.Item
                name="tax"
                label="Tax Rate"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.tax || 0}
                help={house.assumption?.tax && `${formatCurrency(monthlyTaxesAmount)} / month`}
              >
                <InputPercent
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('tax', value);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="propertyInsurance"
                label="Property Insurance"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.propertyInsurance || 0}
              >
                <InputCurrency
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('propertyInsurance', value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="management"
                label="Management Fee"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.management || 0}
              >
                <InputCurrency
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('management', value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="maintenance"
                label="Maintenance Fee"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.maintenance || 0}
              >
                <InputCurrency
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('maintenance', value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="utilities"
                label="Utilities"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.utilities || 0}
              >
                <InputCurrency
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('utilities', value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="hoa"
                label="HOA Fee"
                rules={[{ type: 'number', min: 0 }]}
                initialValue={house.assumption?.hoa || 0}
              >
                <InputCurrency
                  css={inputNumberCss}
                  onChange={(value: string) => {
                    withNumVal(changeAssumption)('hoa', value);
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Col>

      <Col span={12}>
        <Title level={3}>Stats</Title>
        {capRate ? (
          <Statistic
            title="Cap Rate"
            value={capRate.toFixed(2)}
            precision={2}
            formatter={(value) => `${value}%`}
          />
        ) : (
          <Paragraph>Please Enter rental income and purchase price to see the cap rate</Paragraph>
        )}

        {house.assumption && (
          <>
            <BuyVsRentChart
              downPayment={downPayment}
              annualMarketRate={0.07}
              annualInterestRate={0.0275}
              loanTermYears={30}
              purchasePrice={house.price}
              insurance={house.assumption.propertyInsurance || 0}
              mortgageTotal={house.price - downPayment}
              operatingExpenses={monthlyOperatingCosts}
              propertyTaxRate={(house.assumption.tax || 0) / 100}
              inflationRate={(house.assumption.inflation || 0) / 100}
              appreciationRate={(house.assumption.appreciation || 0) / 100}
              netMonthlyRentalIncome={netMonthlyRevenue}
              marginalTaxRate={0.32}
            />

            <p>This chart assumes the following:</p>
            <ul>
              <li>Interest Rate: 2.75%</li>
              <li>Loan Term: 30 years</li>
              <li>Marginal Income Tax Rate: 32%</li>
              <li>
                Market Rate of Return (used to calculate your net worth growth while renting): 7%
              </li>
            </ul>
          </>
        )}
      </Col>
    </Row>
  );
};

export default withUserAndApollo(HousePage);

interface VacancyHelpProps {
  vacancy: number | undefined;
  rentalIncome: number | undefined;
}

const VacancyHelp: React.FC<VacancyHelpProps> = ({ rentalIncome, vacancy }) => {
  if (!rentalIncome || !vacancy || vacancy === 0) {
    return null;
  }

  const vacancyAmount = getVacancyAmount(rentalIncome, vacancy);
  const netMonthlyRevenue = getNetMonthlyRevenue(rentalIncome, vacancy);

  return (
    <>
      <div>Vacancy: {formatCurrency(vacancyAmount)} / month</div>
      <div>Adjusted Rental Income: {formatCurrency(netMonthlyRevenue)}</div>
    </>
  );
};

interface Assumption {
  id: number;
  appreciation: number | undefined;
  closing: number | undefined;
  inflation: number | undefined;
  vacancy: number | undefined;
  tax: number | undefined;
  propertyInsurance: number | undefined;
  management: number | undefined;
  maintenance: number | undefined;
  utilities: number | undefined;
  hoa: number | undefined;
  downPercent: number | undefined;
}

export interface FullHouse extends House {
  rentalIncome: number | undefined;
  assumption: Assumption;
}

const ASSUMPTION_FRAGMENT = gql`
  fragment Assumption on assumptions {
    appreciation
    closing
    downPercent
    hoa
    id
    inflation
    maintenance
    management
    propertyInsurance
    tax
    utilities
    vacancy
  }
`;

const getSum = (nums: Array<number | undefined>): number =>
  nums.reduce((acc = 0, curr = 0) => acc + curr, 0) as number;

export const GET_HOUSE_BY_ID = gql`
  query GetHouseById($id: Int!) {
    houses_by_pk(id: $id) {
      ...House
      rentalIncome
      assumption {
        ...Assumption
      }
    }
  }
  ${HOUSE_FRAGMENT}
  ${ASSUMPTION_FRAGMENT}
`;

export const UPDATE_HOUSE = gql`
  mutation UpdateHouse($id: Int!, $_set: houses_set_input!) {
    update_houses_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      price
      rentalIncome
    }
  }
`;

export const ADD_HOUSE_ASSUMPTIONS = gql`
  mutation AddHouseAssumptions($assumptions: assumptions_insert_input!) {
    insert_assumptions_one(object: $assumptions) {
      ...Assumption
    }
  }
  ${ASSUMPTION_FRAGMENT}
`;

export const UPDATE_HOUSE_ASSUMPTIONS = gql`
  mutation UpdateHouseAssumptions($id: Int!, $_set: assumptions_set_input!) {
    update_assumptions_by_pk(pk_columns: { id: $id }, _set: $_set) {
      ...Assumption
    }
  }
  ${ASSUMPTION_FRAGMENT}
`;
