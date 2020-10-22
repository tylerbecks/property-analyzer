# Property Analyzer
[Check it out 🚀](https://property-analyzer.vercel.app/)


This project is configured with the following:
### Stack
* [NextJS](https://nextjs.org/docs/getting-started)
* [TypeScript](https://www.typescriptlang.org/docs)
* [next-auth](https://next-auth.js.org/getting-started/example) with a sign in and sign out flow
* [Emotion](https://emotion.sh/docs/introduction) for CSS with a basic dashboard layout
* [Jest](https://jestjs.io/docs/en/getting-started) and [jest-dom](https://github.com/testing-library/jest-dom) and [testing-library](https://testing-library.com/docs/react-testing-library/example-intro)

### Linters
* [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
* [eslint-plugin-emotion](https://emotion.sh/docs/eslint-plugin-emotion)
* [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)
* [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
* [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
* [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)
* [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/)
* [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)

In addition, [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://www.npmjs.com/package/husky) come pre-configured to run eslint, prettier, and jest on pre-commit.

### Tools
* [Log Rocket](https://app.logrocket.com/)
* [Testing Playground Chrome Extension](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano?hl=en) for grabbing selectors for tests
* [Vercel](https://vercel.com/tylerbecks/property-analyzer)

## Getting Started

### 1. **Install Dependencies**
```bash
yarn
```

### 2. **Create .env.local**
Create a copy of .env.local.copy named .env.local (it will be ignored by .gitignore). Add the missing values.  Refer to [next-auth docs](https://next-auth.js.org/providers/google) for help.

### 3. **Create Hasura Cloud instance**
[Docs](https://hasura.io/docs/1.0/graphql/cloud/getting-started/index.html#cloud-getting-started)

### 4. **Secure the endpoint**
Add `HASURA_GRAPHQL_ADMIN_SECRET` env var to Hasura and [add admin env variable to herkou](https://hasura.io/docs/1.0/graphql/core/deployment/deployment-guides/heroku.html#add-an-admin-secret)

### 5. **Generate the RSA keys**
```sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pem
```

### 6. **Print the keys in the escaped format**
```sh
awk -v ORS='\\n' '1' private.pem
```

### 7. **Copy the value of the key into the AUTH_PRIVATE_KEY key (in the .env file)**
The `AUTH_PRIVATE_KEY` should look like this (on one line):
```sh
AUTH_PRIVATE_KEY='{"type":"RS256", "key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0U3NR0eyMehHBlx6DK5sJ+Pys9dTWf558kpKVeQvL2oIZEY3\nLvS3/jdrIm/dU4WrIGPki1r/AWXQAyBZ2FKnZROcUWN0IqdmxrC5zTDymuscqhKX\nqxjSwrwOVWHc+zWWmXCQGmDdoCokXd9ZW66nA0BN66MdMC2+d5GrZdKUF305dpzT\nUdzDE12/XwOEUalCM0703eGu8zFwutLYc3+vf2CFOQ1z+rvDQD4N2aZABKTxZRtE\nkMHljnoyKlF9rljNzT/5N8YQE7qn4pBh6CMa1zcSilk9nhgl55n/Kjn2xMieWdIa\nlaOEKw1LqqIjiT1ESkAKfPaIoSSnmTaYy78gbwIDAQABAoIBAF+3t+AYLqraMdj7\n46j2/2lCupR6LZkjYntmdBZRky6YzBunbMchjR9KEsmd5Na0c20NodAFHkdyWy2C\n1vOx4PG9hShHVi4e5kaJPX9UGi60xNgWRpwtbv01aUysw5VyjVvAeXZGxDPh8d2o\nLcJa3fADsV7IqqmE0ez2hi67nZQbkbEUbKs7aGfCE6srCfjCfOadfNnto9+7qDjJ\nnd4rK18H1rBSLTqj4T7wd1K8THgo25vjEuVRbGsEVrNB/B1Dz0pdOqhqukzixfcS\nVL/7uYDXehLasmUQu2VtMFsLqDpAbQgvpoNnzeZuB0WARvygSi/n4t+pCi84hXXe\na1m/01kCgYEA6+i5FwJAPxe2oCc0iignHjA20itTalyUhgJrLa8tTs721GJ3ku0A\n/EJVgmoNOLCQnZMldWvEDGmf6QuaWitq8ZWK/0BmHrEjbDA7m1fPdf3hrNx6eH/i\nazxjAoWA/u0yZg6QvUC7hSOO6WEpFYGuc2+/mHlnm5RLdL3QNIlHyyUCgYEA4yEI\n2deZ9MgmxbnFc76u7VhT1lc1MHpuAcDR3hqKT9xH2fTBaTDpVqeFbQJR5Hu+ZqgT\nL3+zV5kzIz3RaNMGN1IaxDEEx+tDnL9aw8sqawauWZtp7W2EeFvtP8uhHiBWpqVl\nvus6Gpl6hpNg6X96vHRcW+mB13I/h5YWA25EEwMCgYA5YbkrvJNuBVGZsQ+Zj1y8\nfhPHmVxH4c8KranuSc7mfXcSgAT/ywBTW7s65prisCfs/C6/WgAs2MBZykW4Kxlv\nO+W8Yqi0THgGR9En3vsKgz+ScWqkxs6HMQAQS/LtjzqUEnToY8d5AgYwBD8fCRUq\n5QKgjt9Bu5eDBOyQ6td4tQKBgBtDrOdRfTaoDBdyHGSvgBoXn0C8iTL/j1MAjXDG\n6NF7VNiyC8GP0ILJazfRrnjp7cou5Nav0pxyVHQniIq3wihD39irNbK16BDZ25Bj\nQ/1C+Qzing2VNvCnwEwHKpkOMrigZB1N6VSmFdIvwNNmrRoQMcIKvr5ZBY1GE/Bn\nfR53AoGBAIXaWIoDW5d9XwFa8HdxkgMPyLlizckZKyXASYEGWD2VU8P1NwA/bZ1t\nymioQPRJymTBfUL6E44Ebwx25DezjYEun1yqouZ+WZBlsEYtssffzTs2IocZ6aCN\nYfzt3orUEI/rWbRSqYFEuOntzzf3a7r3MtDU41e7iXcNkRSxCAIV\n-----END RSA PRIVATE KEY-----\n"}'
```

### **6. Add Public key to Hasura**
Add Env Var `HASURA_GRAPHQL_JWT_SECRET` in Hasura. It should have the same json format as the `AUTH_PRIVATE_KEY` variable, except with the public key generated in `public.pem`

### **7. Search and edit all `TODO`s**

### **8. Run the development server**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Resources
* [Log Rocket](https://app.logrocket.com/mg0tep/scaffolding/)
* [Hasura Dashboard](https://cloud.hasura.io/projects)
