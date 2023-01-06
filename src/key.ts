import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models/user.model';
import {Credentials} from './repositories/user.repository';


export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>(
    'services.user.service',
  );
}
