import {Entity, model, property, hasOne} from '@loopback/repository';
import {Profie} from './profie.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  first_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  user_name: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'date',
  })
  registration_date?: string;

  @property({
    type: 'string',
    required: true,
  })
  phone_number: string;

  @hasOne(() => Profie)
  profie: Profie;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

