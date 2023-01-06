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
  Filter, repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {Profie, User} from '../models';
import {ProfieRepository, UserRepository} from '../repositories';


export class ProfieUsersController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: User,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(ProfieRepository)
    public profieRepository: ProfieRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/profies')
  @response(200, {
    description: 'Profie model instance',
    content: {'application/json': {schema: getModelSchemaRef(Profie)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profie, {
            title: 'NewProfie',
            exclude: ['id'],
          }),
        },
      },
    })
    profie: Omit<Profie, 'id'>,
  ): Promise<Profie> {
    return this.profieRepository.create(profie);
  }

  @get('/profies/count')
  @response(200, {
    description: 'Profie model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Profie) where?: Where<Profie>,
  ): Promise<Count> {
    return this.profieRepository.count(where);
  }

  @get('/profies/users/{userId}')
  @response(200, {
    description: 'Array of Profie model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profie, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.number('userId') userId: number,
    @param.filter(Profie) filter?: Filter<Profie>,
  ): Promise<Profie[]> {
    const userCheck = await this.profieRepository.find({where: {userId: userId}});
    const matchedUserArr: Profie[] = [];
    if (userCheck[0].gender == "M") {
      const userLatLongPoints: any = userCheck[0].remindAtGeo;
      const userPoints = userLatLongPoints.split(",");
      var stringToFloatPoints = userPoints.map(function (str: any) {
        // using map() to convert array of strings to float numbers
        return parseFloat(str);
      })
      let lat1 = stringToFloatPoints[0];
      let lon1 = stringToFloatPoints[1];
      const profileCheck = await this.profieRepository.find({where: {and: [{userId: {neq: userId}}, {gender: 'F'}]}});
      for (let i = 0; i < profileCheck.length; i++) {
        const profileLatLongPoints: any = profileCheck[i].remindAtGeo;
        const profilePoints = profileLatLongPoints.split(",");
        var stringToFloatPointsProfile = profilePoints.map(function (str: any) {
          // using map() to convert array of strings to float numbers
          return parseFloat(str);
        })
        let lat2 = stringToFloatPointsProfile[0];
        let lon2 = stringToFloatPointsProfile[1];
        //calculate distance of the profiles
        function distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
          var radlat1 = Math.PI * lat1 / 180;
          var radlat2 = Math.PI * lat2 / 180;
          var theta = lon1 - lon2;
          var radtheta = Math.PI * theta / 180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = dist * 180 / Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit == "K") {dist = dist * 1.609344}
          if (unit == "N") {dist = dist * 0.8684}
          return dist;
        }
        var distanceProfile: number = distance(lat1, lon1, lat2, lon2, "K");
        console.log("F", distanceProfile);
        if (distanceProfile < 500) {
          matchedUserArr.push(profileCheck[i]);
        }
      }
      return matchedUserArr;
    }
    const userLatLongPoints: any = userCheck[0].remindAtGeo;
    const userPoints = userLatLongPoints.split(",");
    var stringToFloatPoints = userPoints.map(function (str: any) {
      // using map() to convert array of strings to float numbers
      return parseFloat(str);
    })
    let lat1 = stringToFloatPoints[0];
    let lon1 = stringToFloatPoints[1];
    const profileCheck = await this.profieRepository.find({where: {and: [{userId: {neq: userId}}, {gender: 'M'}]}});
    for (let i = 0; i < profileCheck.length; i++) {
      const profileLatLongPoints: any = profileCheck[i].remindAtGeo;
      const profilePoints = profileLatLongPoints.split(",");
      var stringToFloatPointsProfile = profilePoints.map(function (str: any) {
        // using map() to convert array of strings to float numbers
        return parseFloat(str);
      })
      let lat2 = stringToFloatPointsProfile[0];
      let lon2 = stringToFloatPointsProfile[1];
      //calculate distance of the profiles
      function distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {dist = dist * 1.609344}
        if (unit == "N") {dist = dist * 0.8684}
        return dist;
      }
      var distanceProfile: number = distance(lat1, lon1, lat2, lon2, "K");
      console.log("M", distanceProfile)
      if (distanceProfile < 500) {
        matchedUserArr.push(profileCheck[i]);
      }
    }
    return matchedUserArr;
  }

  @get('/profies/users/samehobbies/{userId}')
  @response(200, {
    description: 'Array of Profie model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profie, {includeRelations: true}),
        },
      },
    },
  })
  async findUsersWithSameHobbies(
    @param.path.number('userId') userId: number,
    @param.filter(Profie) filter?: Filter<Profie>,
  ): Promise<Profie[]> {
    const userCheck = await this.profieRepository.find({where: {userId: userId}});
    const userHobbies = userCheck[0].hobbies;
    const matchedUserArr: Profie[] = [];
    console.log("userhobby", userHobbies);
    if (userCheck[0].gender == "M") {
      const profileCheck = await this.profieRepository.find({where: {and: [{userId: {neq: userId}}, {gender: 'F'}]}});
      for (let i = 0; i < profileCheck.length; i++) {
        console.log('hobma', profileCheck[i].hobbies);
        const userHobbiesCheckMatch = profileCheck[i].hobbies;
        function findCommonElements3(userHobbies: any, userHobbiesCheckMatch: any) {
          return userHobbies.some((item: any) => userHobbiesCheckMatch.includes(item))
        }
        var checkMatch = findCommonElements3(userHobbies, userHobbiesCheckMatch);
        if (checkMatch) {
          matchedUserArr.push(profileCheck[i]);
        }
      }
      return matchedUserArr;
    }
    const profileCheck = await this.profieRepository.find({where: {and: [{userId: {neq: userId}}, {gender: 'M'}]}});
    for (let i = 0; i < profileCheck.length; i++) {
      console.log('hobma', profileCheck[i].hobbies);
      const userHobbiesCheckMatch = profileCheck[i].hobbies;
      function findCommonElements3(userHobbies: any, userHobbiesCheckMatch: any) {
        return userHobbies.some((item: any) => userHobbiesCheckMatch.includes(item))
      }
      var checkMatch = findCommonElements3(userHobbies, userHobbiesCheckMatch);
      if (checkMatch) {
        matchedUserArr.push(profileCheck[i]);
      }
    }
    return matchedUserArr;
  }

  // @patch('/profies')
  // @response(200, {
  //   description: 'Profie PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Profie, {partial: true}),
  //       },
  //     },
  //   })
  //   profie: Profie,
  //   @param.where(Profie) where?: Where<Profie>,
  // ): Promise<Count> {
  //   return this.profieRepository.updateAll(profie, where);
  // }

  // @get('/profies/{id}')
  // @response(200, {
  //   description: 'Profie model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Profie, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Profie, {exclude: 'where'}) filter?: FilterExcludingWhere<Profie>
  // ): Promise<Profie> {
  //   return this.profieRepository.findById(id, filter);
  // }

  // @patch('/profies/{id}')
  // @response(204, {
  //   description: 'Profie PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Profie, {partial: true}),
  //       },
  //     },
  //   })
  //   profie: Profie,
  // ): Promise<void> {
  //   await this.profieRepository.updateById(id, profie);
  // }

  // @put('/profies/{id}')
  // @response(204, {
  //   description: 'Profie PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() profie: Profie,
  // ): Promise<void> {
  //   await this.profieRepository.replaceById(id, profie);
  // }

  // @del('/profies/{id}')
  // @response(204, {
  //   description: 'Profie DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.profieRepository.deleteById(id);
  // }
}
