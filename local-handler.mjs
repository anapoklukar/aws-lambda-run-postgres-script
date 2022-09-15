import pg from 'pg';
const Client = pg.Client;

import {
    getExecutionSqlScript,
    successResponse,
    errResponse,
    envConfig,
} from './helpers.mjs';

const handler = async (event, context, callback) => {
    let script;

    try {
        script = await getExecutionSqlScript();
    } catch (err) {
        return errResponse(err);
    }

    const client = new Client({ ...envConfig.client, ...envConfig.timeouts });

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

handler();
