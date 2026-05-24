import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Movies } from '../movies/entities/movie.entity';
import { initialData } from './data/seed.data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Movies)
    private readonly movieRepository: Repository<Movies>,
  ) {}

  async executeSeed() {
    await this.deleteTables();

    const adminUser = await this.insertAdminUser();
    await this.insertMovies(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  private async insertAdminUser() {
    const seedUser = initialData.user;

    const user = this.userRepository.create({
      ...seedUser,
      password: bcrypt.hashSync(seedUser.password, 10),
    });

    return this.userRepository.save(user);
  }

  private async insertMovies(user: User) {
    const movies = initialData.movies.map((movie) =>
      this.movieRepository.create({
        ...movie,
        user,
      }),
    );

    await this.movieRepository.save(movies);
  }
}
