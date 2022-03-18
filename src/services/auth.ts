import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from 'config';

export class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await hash(password, salt);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    return sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }
}
