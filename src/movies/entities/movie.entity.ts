import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('movies')
@Unique(['user', 'moviedbID'])
export class Movies {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('numeric', {
  })
  moviedbID!: number;

  @Column('text', {
  })
  title!: string;

  @ManyToOne(() => User, (User) => User.movies, {
    eager: true, 
    onDelete: 'CASCADE',
    //cascade: true
  })
  user!: User;
}
