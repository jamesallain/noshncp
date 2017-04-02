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

export const EvaluationUpdateMutation = mutationWithClientMutationId({
  name: 'EvaluationUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    evaluationId: {type: new GraphQLNonNull(GraphQLID)},
    company: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    since: {type: new GraphQLNonNull(GraphQLString)},
    until: {type: new GraphQLNonNull(GraphQLString)}
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
    {
      id: ncpGlobalId,
      evaluationId: evaluationGlobalId,
      company,
      title,
      description,
      country,
      region,
      since,
      until
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      company,
      title,
      country,
      region,
      since,
      until,
      description
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
    const {id: evaluationLocalId} = fromGlobalId(evaluationGlobalId);

    return new Promise((resolve) => {
      return db.collection(ncpCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(ncpLocalId),
            'evaluations._id': new ObjectID(evaluationLocalId)
          }),
          [],
          ({
            $set: {
              'evaluations.$.company': company,
              'evaluations.$.title': title,
              'evaluations.$.country': country,
              'evaluations.$.region': region,
              'evaluations.$.since': since,
              'evaluations.$.until': until,
              'evaluations.$.description': description
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
