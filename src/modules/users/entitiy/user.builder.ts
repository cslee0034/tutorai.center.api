import { UserEntity } from './user.entity';
import { Location } from './user.entity';
import { Gender } from './user.entity';

export class UserBuilder extends UserEntity {
  constructor() {
    super();
    this.name = `nomad_${String(Math.random()).slice(3, 8)}`;
  }

  setEmail(email: string) {
    this.email = email;
    return this;
  }

  setPassword(password: string) {
    this.password = password;
    return this;
  }

  setGender(gender: Gender) {
    this.gender = gender;
    return this;
  }

  setCurrentLocation(location: Location) {
    this.current_location = location;
    return this;
  }

  setBiography(biography: string) {
    this.biography = biography;
    return this;
  }

  setAvatar(avatar: string) {
    this.avatar = avatar;
    return this;
  }

  build() {
    return this;
  }
}
