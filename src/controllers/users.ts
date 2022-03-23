import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { AuthService } from '@src/services/auth';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (err) {
      this.sendCreateUpdateErrorResponse(response, err);
    }
  }

  @Post('authenticate')
  public async authenticate(
    request: Request,
    response: Response
  ): Promise<Response | undefined> {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: 'User not found',
      });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: 'Password does not match',
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return response.send({ ...user.toJSON(), ...{ token } });
  }
}
