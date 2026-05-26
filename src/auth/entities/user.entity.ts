import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movies } from '../../movies/entities/movie.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({name: 'users'})
export class User {

  @ApiProperty({
    description: 'Unique user identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column('text', {
    unique: true,
  })
  email!: string;

  @ApiProperty({
    description: 'Hashed user password',
    example: '$2b$10$abcdefghijklmnopqrstuv',
    writeOnly: true,
  })
  @Column('text', {
    select: false,
  })
  password?: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
  })
  @Column('text')
  fullName!: string;

  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive!: boolean;

  @ApiPropertyOptional({
    description: 'Avatar URL or stored avatar filename',
    example: 'avatar-12345.jpeg',
  })
  @Column('text', { nullable: true })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Roles assigned to the user',
    example: ['user'],
    isArray: true,
    default: ['user'],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles!: string[];

  @ApiProperty({
    description: 'Movies saved by the user',
    type: () => [Movies],
  })
  @OneToMany(() => Movies, (Movies) => Movies.user)
  movies!: Movies[];

  @BeforeInsert()
  checkFiledsbeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFiledsbeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
