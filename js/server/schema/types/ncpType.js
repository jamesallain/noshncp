
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

import assessmentType from './assessmentType'
import diagnosisType from './diagnosisType'
import interventionType from './interventionType'
import evalutationType from './evaluationType'

import nodeInterface from './'


export const ncpType = new GraphQLObjectType({
  name: 'Ncp',
  fields() {
    return {
      id: globalIdField('Ncp', ({_id: ncpLocalId}) => {
        return ncpLocalId;
      }),
      _id: {type: GraphQLID},      
      assessments: {
          type: new GraphQLList(assessmentType),
          description: ''
      },
      diagnosis: {
          type: new GraphQLList(diagnosisType), 
          description: ''
      },
      interventions: {
          type: new GraphQLList(interventionType),
          description: ''
      },
      evaluations: {
          type: new GraphQLList(evaluationType),
          description: ''
      }, 
      fullName: {type: GraphQLString},
      industry: {type: GraphQLString},
      previousCompanies: {type: new GraphQLList(GraphQLString)},
      patientPicture: {type: GraphQLString},
    //   languages: {type: new GraphQLList(languageType)},
    //   skills: {type: new GraphQLList(skillType)},
    //   experiences: {type: new GraphQLList(experienceType)},
    //   educations: {type: new GraphQLList(educationType)},
      title: {type: GraphQLString},
      currentCompany: {type: GraphQLString},
      educationTitle: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString}
    };
  },
  interfaces: [nodeInterface]
});

const {
  connectionType: ncpConnectionType,
  //edgeType: ncpEdgeType
} = connectionDefinitions({
  name: 'Ncp',
  nodeType: ncpType
});
