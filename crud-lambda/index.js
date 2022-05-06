const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Access-Control-Allow-Origin, Authorization",
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "OPTIONS, PUT, GET, DELETE",
        "Allow": "OPTIONS, PUT, GET, DELETE"
    };

    try {
        switch (event.routeKey) {
            case "DELETE /items/{id}":
                await dynamo
                    .delete({
                        TableName: "http-crud-tutorial-items",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                body = `Deleted item ${event.pathParameters.id}`;
                break;
            case "GET /items/{id}":
                body = await dynamo
                    .get({
                        TableName: "http-crud-tutorial-items",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                break;
            case "GET /items":
                body = await dynamo.scan({ TableName: "http-crud-tutorial-items" }).promise();
                break;
            case "POST /items":
                let requestJSON = JSON.parse(event.body);
                await dynamo
                    .put({
                        TableName: "http-crud-tutorial-items",
                        Item: {
                            id: requestJSON.id,
                            output: requestJSON.output
                        }
                    })
                    .promise();
                body = `Put item ${requestJSON.id}`;
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};
