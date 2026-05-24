import { IsInt, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {

  @ApiProperty({
    description: 'TMDB identifier of the movie to save as favorite',
    example: 550,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  moviedbID!: number;

  @ApiProperty({
    description: 'Movie title',
    example: 'Fight Club',
  })
  @IsString()
  @MinLength(1)
  title!: string;
}
