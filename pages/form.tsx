import { gql, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import NewHouseForm from '../components/new-house-form';
import WithUser from '../components/with-user-and-apollo';
import { HOUSE_FRAGMENT } from '../fragments/house';
import { UnsavedHouse } from '../types/house';

const FormPage: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();
  const [addHouse] = useMutation(ADD_HOUSE);

  const onSubmit = (unsavedNewHouse: UnsavedHouse) => {
    addHouse({
      variables: { house: { ...unsavedNewHouse, userId: session.user.id } },
      update: (cache, { data: { insert_houses_one: newHouse } }) => {
        cache.modify({
          fields: {
            houses(existingHouseRefs = []) {
              const newHouseRef = cache.writeFragment({
                data: newHouse,
                fragment: gql`
                  fragment NewHouse on houses {
                    ...House
                  }
                  ${HOUSE_FRAGMENT}
                `,
                fragmentName: 'NewHouse',
              });

              return [...existingHouseRefs, newHouseRef];
            },
          },
        });
      },
    });

    router.push('/');
  };

  return <NewHouseForm onSubmit={onSubmit} />;
};

export default WithUser(FormPage);

const ADD_HOUSE = gql`
  mutation AddHouse($house: houses_insert_input!) {
    insert_houses_one(object: $house) {
      ...House
    }
  }
  ${HOUSE_FRAGMENT}
`;
