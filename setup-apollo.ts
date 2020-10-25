import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

export const createApolloClient = (
  headers: Record<string, string>
): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    uri: 'https://moral-akita-32.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers,
  });
