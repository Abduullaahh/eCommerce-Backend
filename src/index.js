// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./type-defs/index');
const resolvers = require('./resolvers/index');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow requests from any origin, or specify your frontend URL
  credentials: true,
}));

// Connect to MongoDB
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

/// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start(); // Ensure the server is started before applying middleware

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('Server is running on port 4000...');
  });
};

startServer();