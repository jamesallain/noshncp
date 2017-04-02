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
const patientCollectionName = 'patient';

export const PatientUpdateMutation = mutationWithClientMutationId({
  name: 'PatientUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    fullName: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    currentCompany: {type: new GraphQLNonNull(GraphQLString)},
    educationTitle: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)}
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
  mutateAndGetPayload(
    {
      id: patientGlobalId,
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $set: {
              fullName,
              title,
              currentCompany,
              educationTitle,
              country,
              region
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
  }
});

