import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpException } from '../../../core/errors/HttpException';
import { HttpStatus } from '../../../core/errors/http-status';
import { supabaseAdminClient } from '../../supabase/supabase';
import { UserRole } from '../../../core/enums/user-role-enum';

export class VerifyUserRole {
  private authorizedRoles: UserRole[] = [];

  public authorize = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
      const token = await this.verifyToken(accessToken);
      await this.getUserRoleFromProviderAndCheck(token);
    } catch (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }

  public ofRoles = (roles: UserRole[]) => {
    this.authorizedRoles = roles;

    return this;
  }

  private getUserRoleFromProviderAndCheck = async (token: string): Promise<void> => {
    const { data, error } = await supabaseAdminClient.auth.getUser(token);
    if (!data.user || error) throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
    const userRole = data.user.user_metadata.role ?? "";
    if (!userRole || !this.authorizedRoles.includes(userRole)) throw new HttpException(HttpStatus.UNAUTHORIZED, "unauthorized");
  }

  private verifyToken = async (accessToken: string): Promise<string> => {
    const currentToken = accessToken.split(" ");
    const token = currentToken[1];
    return token;
  }
}