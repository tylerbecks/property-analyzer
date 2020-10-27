import { gql, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import NewHouseForm from '../components/new-house-form';
import { UNSAVED_HOUSE_FRAGMENT } from '../fragments/house';
import { UnsavedHouse } from '../types/house';

const ADD_HOUSE = gql`
  mutation AddHouse($house: houses_insert_input!) {
    insert_houses_one(object: $house) {
      ...UnsavedHouse
    }
  }
  ${UNSAVED_HOUSE_FRAGMENT}
`;

const FormPage: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();
  const [addHouse] = useMutation(ADD_HOUSE);

  const onSubmit = (house: UnsavedHouse) => {
    addHouse({
      variables: {
        house: { ...house, userId: session.user.id },
      },
    });

    router.push('/');
  };

  return <NewHouseForm onSubmit={onSubmit} />;
};

export default FormPage;
