import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const hash = await argon2.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hash,
        },
      });

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email ou Username já existem.');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        level: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        level: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async addScore(userId: string, gameId: string, score: number) {
    const user = await this.findOne(userId);
    if (!user) throw new Error('User not found');

    let { xp, level } = user;

    xp += score;

    let xpToNextLevel = level * 100;

    while (xp >= xpToNextLevel) {
      xp -= xpToNextLevel;
      level++;
      xpToNextLevel = level * 100;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        xp,
        level,
      },
      select: { id: true, username: true, level: true, xp: true },
    });
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      take: 10,
      orderBy: {
        xp: 'desc',
      },
      select: {
        id: true,
        username: true,
        level: true,
        xp: true,
      },
    });
  }
}
