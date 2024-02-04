import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'user_profiles',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: 'The auto-incremented id of the user' })
  id: number;

  @ApiProperty()
  @Column({
    comment: 'The email address of the user',
    unique: true,
    length: 30,
    nullable: false,
  })
  email: string;

  @ApiProperty()
  @Column({
    comment: 'The full name of the user',
    length: 30,
    nullable: false,
  })
  name: string;

  @ApiProperty()
  @Column({
    comment: 'The hashed password of the user',
    length: 255,
    nullable: false,
  })
  password: string;

  @ApiProperty()
  @Column({
    comment: 'The gender of the user',
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  gender: string;

  // TODO: City와의 관계로 나타내기
  // @ApiProperty()
  // @Column({
  //   type: 'jsonb', // json과 다르게 indexing이 가능하다.
  //   comment: 'The current location of the user',
  //   nullable: true,
  // })
  // current_location: Location;

  @ApiProperty()
  @Column({
    comment: 'The biography of the user',
    type: 'text',
    nullable: true,
  })
  biography: string;

  @ApiProperty()
  @Column({
    comment: 'The avatar of the user',
    type: 'text',
    default: 'https://...',
  })
  avatar: string;

  @ApiProperty()
  @Column({
    comment: 'The created date of the user',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty()
  @Column({
    comment: 'The updated date of the user',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
