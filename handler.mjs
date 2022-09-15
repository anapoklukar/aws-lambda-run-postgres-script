import ServerlessClient from 'serverless-postgres';

import {
    getExecutionSqlScript,
    successResponse,
    errResponse,
    envConfig,
} from './helpers.mjs';

export const handler = async (event, context, callback) => {
    let script;

    try {
        script = await getExecutionSqlScript();
    } catch (err) {
        return errResponse(err);
    }

    const client = new ServerlessClient({
        ...envConfig.client,
        ...envConfig.timeouts,
        debug: true,
        delayMs: 3000,
    });

    try {
        console.log(
            `Connecting to DB: host ${envConfig.client.host}, port ${envConfig.client.port}, database ${envConfig.client.database}, username ${envConfig.client.user}`
        );
        await client.connect();
    } catch (err) {
        console.log(`Error connecting to DB: ${err}`);
        return errResponse(err);
    }

    let res;
    try {
        res = await client.query(script);
        console.log('Successfully executed script');
    } catch (err) {
        console.log(`Error executing script: ${err}`);
        return errResponse(err);
    }

    try {
        await client.end();
        console.log('Disconnecting from DB');
        return successResponse(res);
    } catch (err) {
        console.log(`Error while disconnecting from DB: ${err}`);
        return errResponse(err);
    }
};
