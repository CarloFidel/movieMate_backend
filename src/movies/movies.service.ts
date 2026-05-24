import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Movies } from './entities/movie.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MoviesService {
  private logger = new Logger('movieService');

  constructor(
    @InjectRepository(Movies)
    private readonly movieRepository: Repository<Movies>,
  ) {}

  async create(createMovieDto: CreateMovieDto, user: User) {
    // const userId = user.id;
    // const moviedbID = createMovieDto.moviedbID

    // const queryBuilder = this.movieRepository.createQueryBuilder('movie');
    // const moviedb = await queryBuilder
    //   .where('movie.userId = :userId AND movie.moviedbID = :moviedbID', {
    //     userId,
    //     moviedbID
    //   })
    //   .getOne();

    // if (moviedb) {
    //   throw new BadRequestException( `La película ${moviedb.title} ya está guardada`);
    // }

    try {
      const movie = this.movieRepository.create({ ...createMovieDto, user });
      await this.movieRepository.save(movie);

      return {
        movie,
      };
    } catch (error: any) {
      this.handleDbException(error);
    }
  }

  async findUserAll(userId: string, paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;

    const queryBuilder = this.movieRepository.createQueryBuilder('movies');
    const movies = await queryBuilder
      .where('movies.userId = :userId', {
        userId,
      })
      .take(limit)
      .skip(offset)
      .getMany();

    if (movies.length === 0)
      throw new NotFoundException(`User ${userId} have no movie`);

    return {
      status: 'ok',
      movies,
    };
  }

  async findOne(id: string) {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) throw new NotFoundException(`No movie with id ${id}`);
    return movie;
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
    return {
      status: 'ok',
      message: 'Deleted succesful',
      deleted: movie,
    };
  }

  private handleDbException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
  }
}
