import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignupInput, SigninInput } from './dto/inputs';
import { AuthReponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJWTToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthReponse> {
    const user = await this.usersService.create(signupInput);

    const token = this.getJWTToken(user.id);

    return { token, user };
  }

  async signin(signinInput: SigninInput): Promise<AuthReponse> {
    const { email, password } = signinInput;

    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Error in credentials');

    const token = this.getJWTToken(user.id);

    return { token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    user.password = '';

    return user;
  }

  revalidateToken(user: User): AuthReponse {
    const token = this.getJWTToken(user.id);

    return { token, user };
  }
}
