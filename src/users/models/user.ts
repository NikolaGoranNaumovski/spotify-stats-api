import { TrackStat } from 'src/stats/models/track-stat';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Spotify_User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Spotify info
  @Column({ unique: true })
  spotifyId: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  spotifyAccessToken: string;

  @Column({ nullable: true })
  spotifyRefreshToken: string;

  @Column({ nullable: true, type: 'timestamptz' })
  spotifyTokenExpiresAt: Date;

  @OneToMany(() => TrackStat, (trackStat) => trackStat.user)
  trackStats: TrackStat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
