import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://devoted-salmon-28.hasura.app/v1/graphql', // TODO
  cache: new InMemoryCache(),
});
