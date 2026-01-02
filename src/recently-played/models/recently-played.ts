import { Spotify_User } from 'src/users/models/user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class RecentlyPlayed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Spotify_User, { onDelete: 'CASCADE' })
  user: Spotify_User;

  @Column()
  trackId: string;

  @Column()
  trackName: string;

  @Column()
  artistName: string;

  @Column({ nullable: true })
  albumName: string;

  @Column({ type: 'timestamptz' })
  playedAt: Date;

  @Column({ nullable: true })
  albumImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
