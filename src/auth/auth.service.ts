import {
  BadRequestException,
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payloda.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return {
        ...userData,
        token: this.getJwToken({ email: user.email, id: user.id }),
      };
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true },
    });

    //primero pregunto si existe un user con eeste mail
    if (!user)
      throw new UnauthorizedException(`No user with this email ${email}`);

    //luego pregunto si la contraseña de ese user coincide con la que viene por dto
    if (!bcrypt.compareSync(password, user.password!))
      throw new UnauthorizedException('Credentials are not valid (passowrd)');

    const id = user.id;

    return {
      ...user,
      token: this.getJwToken({ email: email, id: id }),
    };
  }

  async getAllusers() {
    const users = this.userRepository.find();
    if (!users) throw new BadRequestException(`No users founded`);
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.findOne(id)
    this.userRepository.delete({ id })
    return {
      message: 'ok',
      user
    }
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check servers logs');
  }
}
