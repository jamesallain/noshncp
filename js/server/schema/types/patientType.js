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

import nodeInterface from './'

export const patientType = new GraphQLObjectType({
  name: 'Patient',
  fields() {
    return {     
      id: globalIdField('Patient', ({_id: patientLocalId}) => {
        return patientLocalId;
      }),
      _id: {type: GraphQLID},      

      ncpId: globalIdField('Ncp', ({_ncpId: ncpLocalId}) => {
        return ncpLocalId;
      }),      
      _ncpId: {type: GraphQLID},

      fullName: {type: GraphQLString},
      industry: {type: GraphQLString},
      languages: {type: new GraphQLList(languageType)},
      previousCompanies: {type: new GraphQLList(GraphQLString)},
      patientPicture: {type: GraphQLString},
      skills: {type: new GraphQLList(skillType)},
      title: {type: GraphQLString},
      experiences: {type: new GraphQLList(experienceType)},
      educations: {type: new GraphQLList(educationType)},
      currentCompany: {type: GraphQLString},
      educationTitle: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString}
    };
  },
  interfaces: [nodeInterface]
});


export const {
  connectionType: patientConnectionType,
  //edgeType: patientEdgeType
} = connectionDefinitions({
  name: 'Patient',
  nodeType: patientType
});
