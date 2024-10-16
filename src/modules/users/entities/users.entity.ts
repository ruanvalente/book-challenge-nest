import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from './enums/role.enum';

@Entity('tb_user')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
  })
  name: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
    uniqueItems: true,
  })
  email: string;

  @Column()
  @ApiProperty({
    example: '1234',
    description: 'sua senha gerada de forma criptografada',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: string;

  @ApiPropertyOptional({
    example: UserRole.CLIENT,
    description: 'Role do usuário',
    enum: UserRole,
    required: false,
  })
  role: UserRole;
}
