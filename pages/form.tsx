import { gql, useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/client';

import NewPropertyForm, { NewProperty } from '../components/new-property-form';

// TODO remove
const PROPERTY = gql`
  query GetFirstProperty($id: Int!) {
    properties(where: { id: { _eq: $id } }) {
      id
      name
      price
      type
    }
  }
`;

const ADD_PROPERTY = gql`
  mutation AddProperty($property: properties_insert_input!) {
    insert_properties_one(object: $property) {
      id
    }
  }
`;

const FormPage: React.FC = () => {
  const [session] = useSession();

  const property = useQuery(PROPERTY, {
    variables: { id: 1 },
  });
  const [addProperty] = useMutation(ADD_PROPERTY);

  if (property.loading) return <p>Loading...</p>;
  if (property.error) return <p>Error :(</p>;

  console.log({ session });
  const onSubmit = (newProperty: NewProperty) => {
    const propertyWithUserId = Object.assign({}, newProperty, {
      user_id: session.user.id,
    });

    addProperty({
      variables: {
        property: propertyWithUserId,
      },
    });
  };

  return <NewPropertyForm onSubmit={onSubmit} />;
};

export default FormPage;
