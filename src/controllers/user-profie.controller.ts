import {TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {
  Profie, User
} from '../models';
import {UserRepository} from '../repositories';
import {Geocoder} from '../services';

export class UserProfieController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: User,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject('services.Geocoder') protected geoService: Geocoder
  ) { }

  @get('/users/{id}/profie', {
    responses: {
      '200': {
        description: 'User has one Profie',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Profie),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Profie>,
  ): Promise<Profie> {
    return this.userRepository.profie(id).get(filter);
  }


  @post('/users/{id}/profie', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Profie)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profie, {
            title: 'NewProfieInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) profie: Omit<Profie, 'id'>,
  ): Promise<Profie> {
    if (profie.remindAtAddress) {
      const geo = await this.geoService.geocode(profie.remindAtAddress);

      if (!geo[0]) {
        //address not found
        throw new HttpErrors.BadRequest(
          `Address not found: ${profie.remindAtAddress}`
        )
      }
      profie.remindAtGeo = `${geo[0].y}, ${geo[0].x}`
    }
    return this.userRepository.profie(id).create(profie);
  }

  @patch('/users/{id}/profie', {
    responses: {
      '200': {
        description: 'User.Profie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profie, {partial: true}),
        },
      },
    })
    profie: Partial<Profie>,
    @param.query.object('where', getWhereSchemaFor(Profie)) where?: Where<Profie>,
  ): Promise<Count> {
    return this.userRepository.profie(id).patch(profie, where);
  }

  @del('/users/{id}/profie', {
    responses: {
      '200': {
        description: 'User.Profie DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Profie)) where?: Where<Profie>,
  ): Promise<Count> {
    return this.userRepository.profie(id).delete(where);
  }
}
