import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Profie,
  User,
} from '../models';
import {ProfieRepository} from '../repositories';

export class ProfieUserController {
  constructor(
    @repository(ProfieRepository)
    public profieRepository: ProfieRepository,
  ) { }

  @get('/profies/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Profie',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Profie.prototype.id,
  ): Promise<User> {
    return this.profieRepository.user(id);
  }
}
