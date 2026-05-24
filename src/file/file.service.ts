import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getStaticImage(imageName: string) {
    const path = join(process.cwd(), 'static', 'avatar', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(`No image found with name ${imageName}`);
    } else {
      return path;
    }
  }

  async saveAvatarUrl(imageName: string, user: User) {
    user.avatarUrl = imageName;
    await this.userRepository.save(user);
  }
}
