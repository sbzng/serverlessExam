import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import Ajv from 'ajv';
import schema from '../shared/types.schema.json';

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const ajv = new Ajv();

const validateCrewRole = ajv.compile(schema.definitions['MovieCrewRole']);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const { role, movieId } = event.pathParameters || {};
    const nameSubstring = event.queryStringParameters?.name;

    // verification
    if (!role || !movieId || !validateCrewRole({ crewRole: role, movieId: parseInt(movieId) })) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid role or movieId' }),
        };
    }
    //Build query parameters
    const queryParams = {
        TableName: process.env.MOVIE_CREW_TABLE_NAME,
        KeyConditionExpression: 'crewRole = :role AND movieId = :movieId',
        ExpressionAttributeValues: {
            ':role': role,
            ':movieId': parseInt(movieId),
        },
        // Optionally filter if the name substring is provided
        ...(nameSubstring && {
            FilterExpression: 'contains(names, :nameSubstring)',
            ExpressionAttributeValues: {
                ':role': role,
                ':movieId': parseInt(movieId),
                ':nameSubstring': nameSubstring,
            },
        }),
    };

    try {
        const { Items } = await ddbDocClient.send(new QueryCommand(queryParams));
        return {
            statusCode: 200,
            body: JSON.stringify({ crewMembers: Items }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
