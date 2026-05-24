import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth } from '../auth/decorators/Auth.decorator';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/GetUser.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Auth() //ValidRoles.user, ValidRoles.admin
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 400, description: 'Movie could not be created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMovieDto: CreateMovieDto, @GetUser() user: User) {
    return this.moviesService.create(createMovieDto, user);
  }
  @Get('user/:userId')
  @Auth()
  @ApiResponse({ status: 200, description: 'User movies retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No movies found for this user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUserAll(
    @Query() paginationDto: PaginationDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.moviesService.findUserAll(userId, paginationDto);
  }

  @Get('detail/:id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Movie found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Delete(':id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
