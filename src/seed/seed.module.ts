import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Movies } from '../movies/entities/movie.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],

  imports: [ 
    TypeOrmModule.forFeature([User, Movies]),
    AuthModule,
    MoviesModule
  ]
})
export class SeedModule {}
