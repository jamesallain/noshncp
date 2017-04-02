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
  isNcpCreatorCheck
} from '../../../functions'
import {
  viewerGet,      
  viewerType
} from '../../../types'
import {
  ncpType
} from '../../../types/ncpType'

import {ObjectID} from 'mongodb';
const ncpCollectionName = 'ncp';

export const DiagnosisUpdateMutation = mutationWithClientMutationId({
  name: 'DiagnosisUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    diagnosisId: {type: new GraphQLNonNull(GraphQLID)},
    date: {type: new GraphQLNonNull(GraphQLString)},
    degree: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: ncpType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: ncpGlobalId, diagnosisId: diagnosisGlobalId, date, degree, title},
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      date,
      degree,
      title
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isNcpCreatorCheck(ncpGlobalId, req.user._ncpId))) {
      return new GraphQLError(err);
    }

    const {id: ncpLocalId} = fromGlobalId(ncpGlobalId);
    const {id: diagnosisLocalId} = fromGlobalId(diagnosisGlobalId);

    return new Promise((resolve) => {
      return db.collection(ncpCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(ncpLocalId),
            'diagnosiss._id': new ObjectID(diagnosisLocalId)
          }),
          [],
          ({
            $set: {
              'diagnosiss.$.date': date,
              'diagnosiss.$.degree': degree,
              'diagnosiss.$.title': title
            }
          }),
          ({
            new: true
          }),
          (err, {value: ncp}) => {
            return resolve(ncp);
          }
        );
    });
  }
});