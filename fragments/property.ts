import { gql } from '@apollo/client';

export const UNSAVED_PROPERTY_FRAGMENT = gql`
  fragment UnsavedProperty on properties {
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

export const PROPERTY_FRAGMENT = gql`
  fragment Property on properties {
    id
    user_id
    ...UnsavedProperty
  }
  ${UNSAVED_PROPERTY_FRAGMENT}
`;
