// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure TypeORM with PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT'), 10) || 5432,
        username: config.get<string>('DB_USERNAME') || 'your_username',
        password: config.get<string>('DB_PASSWORD') || 'your_password',
        database: config.get<string>('DB_DATABASE') || 'your_database',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, 
      }),
    }),
    // Configure GraphQL with ApolloDriver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Required in v10
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true, // Optional
      playground: true, // Optional: Enables GraphQL Playground
    }),
    UsersModule,
  ],
})
export class AppModule {}

