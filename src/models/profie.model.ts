import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Profie extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  profile_img?: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  hobbies: string[];

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'string',
    required: true,
  })
  interest: string;

  @property({
    type: 'string'
  })
  remindAtAddress?: string //address, city, zipcode

  @property({
    type: 'string',
  })
  remindAtGeo?: string //latitude, longitude

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Profie>) {
    super(data);
  }
}


