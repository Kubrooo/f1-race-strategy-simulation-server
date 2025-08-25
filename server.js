const Hapi = require('@hapi/hapi');
const simulateRoute = require('./routes/simulate.js');

async function startServer() {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
    routes: {
      cors: { origin: ['*'] }
    }
  });

  server.route(simulateRoute);

  await server.start();
  console.log(`🚀 Server running at ${server.info.uri}`);
}

startServer();
