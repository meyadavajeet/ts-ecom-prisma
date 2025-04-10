# Create project

Initalize empty node project
```bash
npm init -y
```

Install typescript as dev dependency

```bash
 npm install typescript --save-dev
 ```

 Initialize typescript configuration
 ```bash
 npx tsc --init
 ```

 Install types for the node
 ```bash
 npm install @types/node --save-dev
 ```

 Install express and its types
 ```bash
 npm i express
 npm i @types/express --save-dev
 ```


 # for running the server in development mode
 ```
 npm i ts-node nodemon --save-dev
 ```
 Inside the root directory create nodemon.json file
 ```
{
  "watch": ["src"],
  "ext": ".js,.ts",
  "ignore": ["src/**/*.test.ts", "src/**/*.spec.ts"],
  "exec": "npx ts-node ./src/index.ts"
}

 ```

 Install prisma and prisma/client
 ```
 npm i prisma @prisma/client

```
Initialized primsa
```
npx prisma init
```

# Migration in prisma
```
npx prisma migrate dev --name CreateUsersTable
```


# install dotenv pacakge and create secret.ts
```
npm i dotenv
```

# Run Prisma Studio Locally
```
npx prisma studio
```
