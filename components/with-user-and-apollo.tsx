import { ApolloProvider } from '@apollo/client';
import { useSession } from 'next-auth/client';

import { createApolloClient } from '../setup-apollo';
import Layout from './layout';
import Login from './login';

export default function withUserAndApollo<P>(WrappedComponent: React.ComponentType<P>): React.FC {
  const WithUserAndApollo: React.FC = (props) => {
    const [session, loading] = useSession();

    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null;

    if (!session) {
      return <Login />;
    }

    return (
      <ApolloProvider client={createApolloClient({ authorization: `Bearer ${session.token}` })}>
        <Layout>
          <WrappedComponent {...(props as P)} />
        </Layout>
      </ApolloProvider>
    );
  };

  WithUserAndApollo.displayName = `WithUserAndApollo(${getDisplayName(WrappedComponent)})`;

  return WithUserAndApollo;
}

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
