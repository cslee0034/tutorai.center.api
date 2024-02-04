import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../enum/user.enum';

export interface Location {
  country: string;
  city: string;
  district: string;
}

@Entity({
  name: 'user_profiles',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class UserEntity {
  @PrimaryGeneratedColumn({ comment: 'The auto-incremented id of the user' })
  id: number;

  @Column({
    comment: 'The email address of the user',
    unique: true,
    length: 30,
    nullable: false,
  })
  email: string;

  @Column({
    comment: 'The full name of the user',
    length: 30,
    nullable: false,
  })
  name: string;

  @Column({
    comment: 'The hashed password of the user',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    comment: 'The gender of the user',
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  gender: string;

  @Column({
    type: 'jsonb', // json과 다르게 indexing이 가능하다.
    comment: 'The current location of the user',
    nullable: true,
  })
  current_location: Location;

  @Column({
    comment: 'The biography of the user',
    type: 'text',
    nullable: true,
  })
  biography: string;

  @Column({
    comment: 'The avatar of the user',
    type: 'text',
    default: 'https://...',
  })
  avatar: string;

  @Column({
    comment: 'The created date of the user',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    comment: 'The updated date of the user',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
