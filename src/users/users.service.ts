// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.usersRepository.preload({
      id: updateUserInput.id,
      ...updateUserInput,
    });
    if (!user) {
      throw new NotFoundException(`User #${updateUserInput.id} not found`);
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.usersRepository.remove(user);
    return { ...user, id };
  }
}
