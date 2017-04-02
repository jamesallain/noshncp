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
  entityGet,
  promisedArrayGet,
  inputPresentCheck,
  emailValidCheck,
  entityCountGet,
  userUniqueCheck,
  userRegisteredCheck,
  passwordHash,
  passwordGenerate,
  isSignedinCheck,
  isTheUserCheck,
  isPatientCreatorCheck
} from '../../functions'
import {
  viewerGet,      
  viewerType
} from '../../types'
import {
  patientType
} from '../../types/patientType'

import {ObjectID} from 'mongodb';
//For PatientPictureUpdateMutation
import fs from 'fs';
import path from 'path';

const patientCollectionName = 'patient';

export const PatientPictureUpdateMutation = mutationWithClientMutationId({
  name: 'PatientPictureUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    file: {type: GraphQLString}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: patientGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }
   
    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return fs.writeFile(
        path.join(process.cwd(), 'media', patientLocalId),
        req.file.buffer,
        () => {
          return resolve(null);
        }
      );
    })

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(patientCollectionName)
          .findAndModify(
            {_id: new ObjectID(patientLocalId)},
            [],
            ({
              $set: {
                patientPicture: `/${patientLocalId}`
              }
            }),
            ({
              new: true
            }),
            (err, {value: patient}) => {
              return resolve(patient);
            }
          );
      });
    });
  }
});