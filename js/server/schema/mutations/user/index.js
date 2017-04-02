'use strict';

import {  
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError
} from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';
import {
  inputPresentCheck,
  emailValidCheck,
  userUniqueCheck,
  userRegisteredCheck,
  passwordHash,
  passwordGenerate,
  isSignedinCheck,
  isTheUserCheck,
  isProfileCreatorCheck
} from '../../functions'
import {
    viewerGet,
    userType,   
    viewerType
} from '../../types'

import {userCrudMailSend} from '../../../mailer';

import {ObjectID} from 'mongodb';
import passport from 'passport';
import emailValidator from 'email-validator';
import bcryptjs from 'bcryptjs';
import passwordGenerator from 'password-generator';


const profileCollectionName = 'profile';
const patientCollectionName = 'patient';
const ncpCollectionName = 'ncp';
const userCollectionName = 'user';

export const UserCreateMutation = mutationWithClientMutationId({
  name: 'UserCreate',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email, password}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }
    if ((err = emailValidCheck(email))) {
      return new GraphQLError(err);
    }
    if ((err = await userUniqueCheck(email, db))) {
      return new GraphQLError(err);
    }

    const _profileId = new ObjectID();
    const _patientId = new ObjectID();

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: _profileId},
          [],
          ({
            $set: {
              fullName: null,
              industry: null,
              languages: [],
              previousCompanies: [],
              profilePicture: null,
              skills: [],
              title: null,
              experiences: [],
              educations: [],
              currentCompany: null,
              educationTitle: null,
              country: null,
              region: null
            }
          }),
          ({
            upsert: true,
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    })

    .then(()=>{
      return new Promise((resolve) => {
       return db.collection(patientCollectionName)
        .findAndModify(
          {_id: _patientId},
          [],
          ({
            $set: {
              fullName: null,
              industry: null,
              languages: [],
              previousCompanies: [],
              patientPicture: null,
              skills: [],
              title: null,
              experiences: [],
              educations: [],
              currentCompany: null,
              educationTitle: null,
              country: null,
              region: null,
              assessments:[],
              diagnosis:[],
              interventions:[],
              evaluations:[]
            }
          }),
          ({
            upsert: true,
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
      });
    })   

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(userCollectionName)
          .findAndModify(
            {_id: new ObjectID()},
            [],
            ({
              $set: {
                email,
                password: passwordHash(password),
                _profileId,
                _patientId
              }
            }),
            ({
              upsert: true,
              new: true
            }),
            (err,  {value: user}) => {
              req.logIn(user, () => {
                userCrudMailSend(
                  'userCreate',
                  email,
                  password
                );
                return resolve(user);
              });
            }
          );
      });
    });
  }
});

export const UserUpdateMutation = mutationWithClientMutationId({
  name: 'UserUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({id: userGlobalId, email, password}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isTheUserCheck(userGlobalId, req.user._id))) {
      return new GraphQLError(err);
    }
    if ((err = emailValidCheck(email))) {
      return new GraphQLError(err);
    }
    if (email !== req.user.email &&
        (err = await userUniqueCheck(email, db))) {
      return new GraphQLError(err);
    }

    const {id: userLocalId} = fromGlobalId(userGlobalId);

    return new Promise((resolve) => {
      return db.collection(userCollectionName)
        .findAndModify(
          {_id: new ObjectID(userLocalId)},
          [],
          ({
            $set: {
              email,
              password: passwordHash(password)
            }
          }),
          ({
            new: true
          }),
          (err, {value: user}) => {
            req.logIn(user, () => {
              userCrudMailSend(
                'userUpdate',
                email,
                password
              );
              return resolve(user);
            });
          }
        );
    });
  }
});

export const UserDeleteMutation = mutationWithClientMutationId({
  name: 'UserDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve() {
        return {};
      }
    }
  },
  mutateAndGetPayload({id: userGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isTheUserCheck(userGlobalId, req.user._id))) {
      return new GraphQLError(err);
    }

    const {id: userLocalId} = fromGlobalId(userGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(req.user._profileId)},
          [],
          {},
          {remove: true},
          () => {
            return resolve(null);
          }
        );
    })
    .then(() => {
      return new Promise((resolve) => {
        return db.collection(userCollectionName)
          .findAndModify(
            {_id: new ObjectID(userLocalId)},
            [],
            {},
            {remove: true},
            (err, {value: user}) => {
              userCrudMailSend(
                'userDelete',
                user.email,
                undefined
              );
              req.logout();
              return resolve(user);
            }
          );
      });
    });
  }
});



export const UserSigninMutation = mutationWithClientMutationId({
  name: 'UserSignin',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email, password}, {req}) {

    let err;
    if ((err = inputPresentCheck({email, password}))) {
      return new GraphQLError(err);
    }

    return new Promise((resolve) => {
      return passport.authenticate('local', (err, user, info) => {
        if (info) {
          return resolve(new GraphQLError(info));
        }

        return req.logIn(user, () => {
          return resolve(user);
        });
      })({
        ...req,
        body: {
          email,
          password
        }
      });
    });
  }
});

export const UserSignoutMutation = mutationWithClientMutationId({
  name: 'UserSignout',
  inputFields: {},
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    }
  },
  mutateAndGetPayload(_, {req}) {
    req.logout();
    return {};
  }
});

export const UserPasswordResetMutation = mutationWithClientMutationId({
  name: 'UserPasswordReset',
  inputFields: {
    email: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: userType,
      resolve(node) {
        return node;
      }
    }
  },
  async mutateAndGetPayload({email}, {db}) {

    let err;
    if ((err = inputPresentCheck({email}))) {
      return new GraphQLError(err);
    }

    if ((err = await userRegisteredCheck(email, db))) {
      return new GraphQLError(err);
    }

    const password = passwordGenerate();

    return new Promise((resolve) => {
      return db.collection(userCollectionName)
        .findAndModify(
          {email},
          [],
          ({
            $set: {
              password: passwordHash(password)
            }
          }),
          ({
            new: true
          }),
          (err, {value: user}) => {
            userCrudMailSend(
              'userPasswordReset',
              user.email,
              password
            );
            return resolve(user);
          }
        );
    });
  }
});
