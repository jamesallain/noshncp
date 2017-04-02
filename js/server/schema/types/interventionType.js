
'use strict';

import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError
} from 'graphql';
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId
} from 'graphql-relay';
import {
  entityGet,
  promisedArrayGet,  
} from '../functions'

import {ObjectID} from 'mongodb';

let _db;
export const userCollectionName = 'user';
export const profileCollectionName = 'profile';
export const patientCollectionName = 'patient';
export const ncpCollectionName = 'ncp';

export const interventionType = new GraphQLObjectType({
  name: 'Intervention',
  fields() {
    return {
      id: globalIdField('Intervention', ({_id: interventionLocalId}) => {
        return interventionLocalId;
      }),
      _id: {type: GraphQLID},
      target: {
          type: GraphQLString,
          description: ''
      },
      intervention: {
          type: GraphQLString, 
          description: ''
      },
      details: {
          type: GraphQLString,
          description: ''
      },
      major: {type: GraphQLString},
      date: {type: GraphQLString},
      degree: {type: GraphQLString},
      title: {type: GraphQLString},
      company: {type: GraphQLString},
      description: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString},
      location: {type: GraphQLString},
      since: {type: GraphQLString},
      title: {type: GraphQLString},
      until: {type: GraphQLString}
    };
  }
});