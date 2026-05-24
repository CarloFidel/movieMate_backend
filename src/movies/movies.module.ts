import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from './entities/movie.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [TypeOrmModule.forFeature([Movies]), AuthModule],
})
export class MoviesModule {}
