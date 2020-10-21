import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: 'https://moral-akita-32.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
});
