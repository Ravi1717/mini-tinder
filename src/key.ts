import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models/user.model';
import {Credentials} from './repositories/user.repository';
import {FileUploadHandler} from './types';

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>(
    'services.user.service',
  );
}

export const FILE_UPLOAD_SERVICE = BindingKey.create<FileUploadHandler>('services.FileUpload')

export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');
