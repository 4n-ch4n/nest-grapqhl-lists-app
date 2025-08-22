import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, SigninInput } from './dto/inputs';
import { AuthReponse } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => AuthReponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthReponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthReponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthReponse, { name: 'signin' })
  async signin(
    @Args('signinInput') signinInput: SigninInput,
  ): Promise<AuthReponse> {
    return this.authService.signin(signinInput);
  }

  @Query(() => AuthReponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurentUser() user: User): AuthReponse {
    return this.authService.revalidateToken(user);
  }
}
