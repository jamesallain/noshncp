
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


export const evaluationType = new GraphQLObjectType({
  name: 'Evaluation',
  fields() {
    return {
      id: globalIdField('Evaluation', ({_id: evaluationLocalId}) => {
        return evaluationLocalId;
      }),
      _id: {type: GraphQLID},
      diagnosis: {
          type: GraphQLString,
          description: ''
      },
      monitoring: {
          type: new GraphQLList(assessmentType),
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
      until: {type: GraphQLString},
      name: {type: GraphQLString},
      recommendations: {type: GraphQLString} 
    };
  }
});
