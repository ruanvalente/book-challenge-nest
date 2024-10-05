import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './enums/role.enum';

@Entity('tb_user')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}
