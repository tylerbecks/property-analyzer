import { gql } from '@apollo/client';

export const PROPERTY_FRAGMENT = gql`
  fragment PROPERTY on properties {
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
`;
