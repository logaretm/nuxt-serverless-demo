const awsServerlessExpress = require('aws-serverless-express');

// import the server factory function we created.
const { createApp } = require('./server');

// Store a reference to the promise as we don't want to keep creating the server instance.
const appPromise = createApp();

exports.nuxt = async (event, context) => {
  // should return a fastify instance once resolved.
  const app = await appPromise;

  // proxies the request to our underlying fastify server.
  return awsServerlessExpress.proxy(app.server, event, context, 'PROMISE')
    .promise;
};
