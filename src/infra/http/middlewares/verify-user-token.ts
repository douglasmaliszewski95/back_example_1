import { FastifyReply, FastifyRequest } from 'fastify'
import { supabaseAdminClient } from '../../supabase/supabase'
import { HttpException } from '../../../core/errors/HttpException';
import { HttpStatus } from '../../../core/errors/http-status';

export async function verifyUserToken(req: FastifyRequest, res: FastifyReply) {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
    const currentToken = accessToken.split(" ");
    const token = currentToken[1];
    const { data, error } = await supabaseAdminClient.auth.getUser(token);
    if (!data.user || error) throw new HttpException(HttpStatus.UNAUTHORIZED, "User not found");
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
}