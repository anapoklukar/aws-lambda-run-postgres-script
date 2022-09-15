# AWS Lambda for running scripts in Postgres SQL

## Local Development

1. Start your local postgres database (with preferred credentials):

```sh
docker run --name postgresql -e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres
```

2. Complete the `.env` file with the following local variables regarding your database information and set the timeout variables to preferred values (or leave them unset to get the default timeouts):

```sh
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

STATEMENT_TIMEOUT=
QUERY_TIMEOUT=
CONNECTION_TIMEOUT=
```

-   `STATEMENT_TIMEOUT`: number of milliseconds before a statement in query will time out, default is no timeout
-   `QUERY_TIMEOUT`: number of milliseconds before a query call will timeout, default is no timeout
-   `CONNECTION_TIMEOUT`: number of milliseconds to wait for a connection, default is no timeout

3. Provide an executable sql script as an environmental variable `DB_SCRIPT` or as a parameter from AWS Parameter Store - if using AWS Parameter Store, set an environmental variable `DB_SCRIPT_PARAM_STORE` with the value of the parameter's path

4. Install required dependencies:

```sh
npm install
```

5. Add `"type": "module"` to the created `package.json`

6. Execute `local-handler.mjs`

```sh
node local-handler.mjs
```

## Running on AWS Lambda

1. Install required dependencies:

```sh
npm install
```

2. Add `"type": "module"` to the created `package.json`

3. Create a `.zip`

4. Add and complete the following variables as environmental variables in your Lambda configuration and set the timeout variables to preferred values (or leave them unset to get the default timeouts):

```sh
DB_HOST
DB_PORT
DB_DATABASE
DB_USERNAME
DB_PASSWORD

STATEMENT_TIMEOUT
QUERY_TIMEOUT
CONNECTION_TIMEOUT
```

-   `STATEMENT_TIMEOUT`: number of milliseconds before a statement in query will time out, default is no timeout
-   `QUERY_TIMEOUT`: number of milliseconds before a query call will timeout, default is no timeout
-   `CONNECTION_TIMEOUT`: number of milliseconds to wait for a connection, default is no timeout

5. Provide an executable sql script as an environmental variable `DB_SCRIPT` or as a parameter from AWS Parameter Store - if using AWS Parameter Store, set an environmental variable `DB_SCRIPT_PARAM_STORE` with the value of the parameter's path

6. Set the handler as `handler.handler` in the Lambda runtime settings

7. Optionally, Lambda's timeout can be set in Lambda configuration.

8. Deploy the `.zip` file
