import 'dotenv/config';
import AWS from 'aws-sdk';

export const getExecutionSqlScript = async () => {
    try {
        checkEnv();
    } catch (err) {
        throw err;
    }

    if (envConfig.dbScript) {
        return envConfig.dbScript;
    } else if (envConfig.dbScriptParamStore) {
        try {
            const SSMClient = new AWS.SSM({
                region: 'eu-central-1',
            });
            const options = {
                Name: envConfig.dbScriptParamStore,
                WithDecryption: true,
            };
            let res = await SSMClient.getParameter(options).promise();
            return res.Parameter.Value;
        } catch (err) {
            console.log(`Error accessing AWS parameter store: ${err}`);
            throw err;
        }
    }
};

export const successResponse = function (body) {
    let response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
        multiValueHeaders: {},
        body: body,
    };
    return response;
};

export const errResponse = function (err) {
    let response = {
        statusCode: err.statusCode,
        headers: {
            'Content-Type': 'text/plain',
            'x-amzn-ErrorType': err.code,
        },
        isBase64Encoded: false,
        body: err.code + ': ' + err.message,
    };
    return response;
};

const checkEnv = () => {
    const envs = [
        'DB_HOST',
        'DB_PORT',
        'DB_DATABASE',
        'DB_USERNAME',
        'DB_PASSWORD',
    ];

    for (let i in envs) {
        if (!process.env[envs[i]]) {
            console.log(`Error: Missing env variable ${envs[i]}`);
            const error = new Error(`Missing env variable ${envs[i]}`);
            error.code = '400';
            error.statusCode = 400;
            throw error;
        }
    }

    if (!(process.env.DB_SCRIPT || process.env.DB_SCRIPT_PARAM_STORE)) {
        console.log('Error: Missing script');
        const error = new Error('Missing script');
        error.code = '400';
        error.statusCode = 400;
        throw error;
    }
};

export const envConfig = {
    client: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    dbScript: process.env.DB_SCRIPT,
    dbScriptParamStore: process.env.DB_SCRIPT_PARAM_STORE,
    timeouts: {
        statement_timeout: process.env.STATEMENT_TIMEOUT,
        query_timeout: process.env.QUERY_TIMEOUT,
        connectionTimeoutMillis: process.env.CONNECTION_TIMEOUT,
    },
};
