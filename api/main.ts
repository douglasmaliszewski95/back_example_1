import { fastify } from "../src/main"

export default async function handler(request: Request, response: Response) {
  await fastify.ready()
  fastify.server.emit('request', request, response)
}