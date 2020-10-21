import { gql, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import PropertyForm from '../components/new-property-form';
import { PROPERTY_FRAGMENT } from '../fragments/property';
import { Property } from '../types/property';
import { GET_PROPERTIES } from './index';

const ADD_PROPERTY = gql`
  mutation AddProperty($property: properties_insert_input!) {
    insert_properties_one(object: $property) {
      ...PROPERTY
    }
  }
  ${PROPERTY_FRAGMENT}
`;

const FormPage: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();
  const [addProperty] = useMutation(ADD_PROPERTY, {
    update(cache, { data: { insert_properties_one } }) {
      console.log({ cache, insert_properties_one });

      cache.modify({
        fields: {
          properties(existingProperties = []) {
            const newPropertyRef = cache.writeQuery({
              data: insert_properties_one,
              query: GET_PROPERTIES,
            });

            return [...existingProperties, newPropertyRef];
          },
        },
      });
    },
  });

  const onSubmit = (Property: Property) => {
    const propertyWithUserId = Object.assign({}, Property, {
      user_id: session.user.id,
    });

    addProperty({
      variables: {
        property: propertyWithUserId,
      },
    });

    router.push('/');
  };

  return <PropertyForm onSubmit={onSubmit} />;
};

export default FormPage;
