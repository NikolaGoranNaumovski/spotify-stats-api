import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Spotify_User } from './models/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Spotify_User) private repo: Repository<Spotify_User>,
  ) {}

  async upsertSpotifyUser(data: {
    spotifyId: string;
    displayName: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }) {
    let user = await this.repo.findOne({
      where: { spotifyId: data.spotifyId },
    });

    if (!user) {
      user = this.repo.create({ spotifyId: data.spotifyId });
    }

    user.displayName = data.displayName;
    user.email = data.email || user.email;
    user.spotifyAccessToken = data.accessToken;
    user.spotifyRefreshToken = data.refreshToken;
    user.spotifyTokenExpiresAt = new Date(Date.now() + data.expiresIn * 1000);

    return await this.repo.save(user);
  }

  async findCreatorUser(): Promise<Spotify_User> {
    const user = await this.repo.findOne({
      where: { email: 'naumovski.code@gmail.com' },
    });

    if (!user) {
      throw new Error('Creator user not found');
    }
    return user;
  }

  async findById(id: string): Promise<Spotify_User | null> {
    return await this.repo.findOne({ where: { id } });
  }
}
