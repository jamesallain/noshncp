
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

export const diagnosisType = new GraphQLObjectType({
  name: 'Diagnosis',
  fields() {
    return {
      id: globalIdField('Diagnosis', ({_id: diagnosisLocalId}) => {
        return diagnosisLocalId;
      }),
      _id: {type: GraphQLID},
      problem: {
          type: GraphQLString,
          description: 'Nutrition Care Process Terminology (NCPT) diagnosis term'
      },
      etiology: {
          type: GraphQLString, 
          description: ''
      },
      signs: {
          type: GraphQLString, 
          description: ''
      },
      status: {
          type: GraphQLString, 
          description: ''
      },
      source: {
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

