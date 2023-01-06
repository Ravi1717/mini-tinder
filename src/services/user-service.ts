import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';

export class MyUserService implements UserService<User, Credentials>{

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    // implement this method
    console.log('verify cre', credentials);
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    });
    console.log('foundUser', foundUser);
    if (!foundUser) {
      throw new HttpErrors.NotFound('user not found');
    }
    return foundUser;
    //   const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
    //   if (!passwordMatched)
    //     throw new HttpErrors.Unauthorized('password is not valid');
    //   return foundUser;
    // }
    //convertToUserProfile(user:User):UserProfile
  }
  convertToUserProfile(user: User): UserProfile {
    let userName = '';
    if (user.first_name)
      userName = user.first_name;
    if (user.first_name) {
      userName = user.first_name ? `${user.first_name} ${user.first_name}` : user.first_name;
    }
    return {
      [securityId]: user.id!.toString(),
      name: user.user_name,
      id: user.id,
      email: user.email
    };
  }
}
