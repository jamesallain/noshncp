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

export const DiagnosisDeleteMutation = mutationWithClientMutationId({
  name: 'DiagnosisDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    diagnosisId: {type: new GraphQLNonNull(GraphQLID)}
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
    {id: ncpGlobalId, diagnosisId: diagnosisGlobalId},
    {db, req}
  ) {

    let err;
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
          {_id: new ObjectID(ncpLocalId)},
          [],
          ({
            $pull: {
              diagnosiss: {
                _id: new ObjectID(diagnosisLocalId)
              }
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
