import { gql, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import PropertyForm from '../components/new-property-form';
import { UNSAVED_PROPERTY_FRAGMENT } from '../fragments/property';
import { Property } from '../types/property';

const ADD_PROPERTY = gql`
  mutation AddProperty($property: properties_insert_input!) {
    insert_properties_one(object: $property) {
      ...UnsavedProperty
    }
  }
  ${UNSAVED_PROPERTY_FRAGMENT}
`;

const FormPage: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();
  const [addProperty] = useMutation(ADD_PROPERTY);

  const onSubmit = (property: Property) => {
    const propertyWithUserId = Object.assign({}, property, {
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
