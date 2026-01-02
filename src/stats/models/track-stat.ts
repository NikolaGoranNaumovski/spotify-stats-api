import { Spotify_User } from 'src/users/models/user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TrackStat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Spotify_User, (user) => user.trackStats, {
    onDelete: 'CASCADE',
  })
  user: Spotify_User;

  @Column()
  trackId: string;

  @Column()
  trackName: string;

  @Column()
  artistName: string;

  @Column({ nullable: true })
  albumName: string;

  @Column()
  timeRange: '1hr' | '24hr' | '7day' | '1month' | '6month' | '12month';

  @Column()
  rank: number;

  @Column({ type: 'int', nullable: true })
  durationMs: number;

  @Column({ nullable: true })
  albumImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
