import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Profie, User} from '../models';
import {ProfieRepository} from './profie.repository';

export type Credentials = {
  email: string;
  password: string;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {

  public readonly profie: HasOneRepositoryFactory<Profie, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProfieRepository') protected profieRepositoryGetter: Getter<ProfieRepository>,
  ) {
    super(User, dataSource);
    this.profie = this.createHasOneRepositoryFactoryFor('profie', profieRepositoryGetter);
    this.registerInclusionResolver('profie', this.profie.inclusionResolver);
  }
}
