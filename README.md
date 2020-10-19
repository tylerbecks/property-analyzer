## Fork Me!
This repo is a quick way to start any new project.  It comes configured with the following:
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

## Getting Started

1. Install Dependencies
```bash
npm i
# or
yarn
```

2. Create a copy of .env.local.copy named .env.local (it will be ignored by .gitignore). Add the missing values.  Refer to [next-auth docs](https://next-auth.js.org/providers/google) for help.

3. Create [Hasura Cloud](https://hasura.io/docs/1.0/graphql/cloud/getting-started/index.html#cloud-getting-started) instance

4. Search and edit all `TODO`s

5. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Resources
* [Log Rocket](https://app.logrocket.com/mg0tep/scaffolding/)
* [Hasura Dashboard](https://cloud.hasura.io/projects)
