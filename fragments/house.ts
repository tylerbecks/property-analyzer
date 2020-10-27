import { gql } from '@apollo/client';

export const UNSAVED_HOUSE_FRAGMENT = gql`
  fragment UnsavedHouse on houses {
    address1
    address2
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

export const HOUSE_FRAGMENT = gql`
  fragment House on houses {
    id
    userId
    ...UnsavedHouse
  }
  ${UNSAVED_HOUSE_FRAGMENT}
`;
