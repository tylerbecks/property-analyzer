import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

type Headers = { authorization: string };

export const createApolloClient = (headers: Headers): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    uri: 'https://moral-akita-32.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers,
  });
