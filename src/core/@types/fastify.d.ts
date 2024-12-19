import FastifySchema from 'fastify';

declare module 'fastify' {
  interface FastifySchema {
    requestBody?: unknown
  }
}