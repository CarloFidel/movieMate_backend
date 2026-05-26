import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginUserDto } from './dto/index';
import { GetUser } from './decorators/GetUser.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/Auth.decorator';
import { ValidRoles } from './interfaces/roles.interfaces';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'User was not created' })
  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User logged in successfully', type: User })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('user/:userId')
  @Auth()
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('userId') userId: string) {
    return this.authService.findOne(userId);
  }

  @Delete('user/:userId')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'User deleted', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteOne(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }

  @Get('users')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: User, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  privateRoute3(@GetUser() user: User) {
    return this.authService.getAllusers();
  }
}
