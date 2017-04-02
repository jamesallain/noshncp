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

export const EvaluationDeleteMutation = mutationWithClientMutationId({
  name: 'EvaluationDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    evaluationId: {type: new GraphQLNonNull(GraphQLID)}
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
    {id: ncpGlobalId, evaluationId: evaluationGlobalId},
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
    const {id: evaluationLocalId} = fromGlobalId(evaluationGlobalId);

    return new Promise((resolve) => {
      return db.collection(ncpCollectionName)
        .findAndModify(
          {_id: new ObjectID(ncpLocalId)},
          [],
          ({
            $pull: {
              evaluations: {
                _id: new ObjectID(evaluationLocalId)
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

