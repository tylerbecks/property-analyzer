import { gql, useQuery } from '@apollo/client';

const AUTHOR = gql`
  query GetAuthor {
    author {
      id
      name
    }
  }
`;

const Author: React.FC = () => {
  const { loading, error, data } = useQuery(AUTHOR);
  console.log({ data });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const firstAuthor = data.author[0];

  return (
    <div>
      <p>ID: {firstAuthor.id}</p>
      <p>Name: {firstAuthor.name}</p>
    </div>
  );
};

export default Author;
