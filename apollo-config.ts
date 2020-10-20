import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://moral-akita-32.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
});
