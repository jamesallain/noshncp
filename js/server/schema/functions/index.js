'use strict';

import {  
  fromGlobalId  
} from 'graphql-relay';

import emailValidator from 'email-validator';
import bcryptjs from 'bcryptjs';
import passwordGenerator from 'password-generator';

const userCollectionName = 'user';

export const entityGet = (query, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .findOne(
        query,
        (err, entity) => {
          return resolve(entity);
        }
      );
  });
};

export const promisedArrayGet = (query, sort, limit, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray((err, entities) => {
        return resolve(entities);
      });
  });
};

export const inputPresentCheck = (input) => {
  return Object.keys(input)
    .reduce((memo, key) => {
      if (!memo) {
        if (!input[key]) {
          return {
            message: 'input required',
            source: key
          };
        }

        return null;
      }

      return memo;

    }, null);
};

export const emailValidCheck = (email) => {
  return (emailValidator.validate(email)) ?
    null :
    ({
      message: 'invalid',
      source: 'email'
    });
};

export const entityCountGet = (query, collectionName, db) => {
  return new Promise((resolve) => {
    return db.collection(collectionName)
      .find(query)
      .count((err, count) => {
        return resolve(count);
      });
  });
};


export const userUniqueCheck = (email, db) => {
  return entityCountGet(
    {email},
    userCollectionName,
    db
  )
    .then((count) => {
      if (count) {
        return {
          message: 'registered',
          source: 'email'
        };
      }

      return null;
    });
};

export const userRegisteredCheck = (email, db) => {
  return entityCountGet(
    {email},
    userCollectionName,
    db
  )
    .then((count) => {
      if (!count) {
        return {
          message: 'not registered',
          source: 'email'
        };
      }

      return null;
    });
};

export const passwordHash = (password) => {
  const salt = bcryptjs.genSaltSync(4);
  return bcryptjs.hashSync(password, salt);
};

export const passwordGenerate = () => {
  return passwordGenerator();
};

export const isSignedinCheck = (req) => {
  return (!req.user) ?
    ({
      message: 'not signedin',
      source: 'auth'
    }) :
    null;
};

export const isTheUserCheck = (userGlobalId, _userId) => {
  const {id: userLocalId} = fromGlobalId(userGlobalId);

  return (userLocalId.toString() !== _userId.toString()) ?
    ({
      message: 'not authorised',
      source: 'auth'
    }) :
    null;
};

export const isProfileCreatorCheck = (profileGlobalId, _profileId) => {
  const {id: profileLocalId} = fromGlobalId(profileGlobalId);

  return (profileLocalId.toString() !== _profileId.toString()) ?
    ({
      message: 'not authorised',
      source: 'auth'
    }) :
    null;
};

export const isPatientCreatorCheck = (patientGlobalId, _patientId) => {
  const {id: patientLocalId} = fromGlobalId(patientGlobalId);

  return (patientLocalId.toString() !== _patientId.toString()) ?
    ({
      message: 'not authorised',
      source: 'auth'
    }) :
    null;
};