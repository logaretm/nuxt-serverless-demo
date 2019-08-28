const path = require('path');
const awsServerlessExpress = require('aws-serverless-express');
const { Nuxt } = require('nuxt-start');

// Define a list of mime types that we will serve.
// Let's serve everything using a wild card
const binaryTypes = ['*/*'];

// Pass in our custom server function, which uses the aws-serverless-proxy
// to convert our default handler to a serverless compatible one.
const fastify = require('fastify')({
  serverFactory(handler) {
    return awsServerlessExpress.createServer(handler, null, binaryTypes);
  }
});

// Serve the `.nuxt/dist` folder using the `/_nuxt` prefix.
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '.nuxt', 'dist'),
  prefix: '/_nuxt/'
});

/**
 * Creates a fastify server with Nuxt middleware attached.
 **/
exports.createApp = async function start() {
  const config = require('./nuxt.config.js');

  // In the Nuxt programmatic API
  // We need to explicitly set the dev to false.
  const nuxt = new Nuxt(Object.assign(config, { dev: false }));

  // wait for nuxt to be ready.
  await nuxt.ready();
  fastify.use(nuxt.render);

  // wait for fastify to be ready.
  await fastify.ready();

  return fastify;
};
