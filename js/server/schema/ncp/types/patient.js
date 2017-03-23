'use strict';

import {
  GraphQLSchema,
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

const patientType = new GraphQLObjectType({
  name: 'Patient',
  fields() {
    return {
      id: globalIdField('Patient', ({_id: patientLocalId}) => {
        return patientLocalId;
      }),
      _id: {type: GraphQLID},
      fullName: {type: GraphQLString},
      industry: {type: GraphQLString},
     // title: {type: GraphQLString},
    //   patientPicture: {type: GraphQLString},
    //   currentCompany: {type: GraphQLString},
    //   educationTitle: {type: GraphQLString},
    //   country: {type: GraphQLString},
    //   region: {type: GraphQLString},
      assessment: {type: new GraphQLList(assessmentType)},
      diagnosis: {type: new GraphQLList(diagnosisType)},
      intervention: {type: new GraphQLList(interventionType)},
      evaluation: {type: new GraphQLList(evaluationType)},
    //educations: {type: new GraphQLList(educationType)},      
    };
  },
  interfaces: [nodeInterface]
});


const {
  connectionType: patientConnectionType
} = connectionDefinitions({
  name: 'Patient',
  nodeType: patientType
});

const assessmentType = new GraphQLObjectType({
  name: 'Assessment',
  fields() {
    return {
      id: globalIdField('Assessment', ({_id: assessmentLocalId}) => {
        return educationLocalId;
      }),
      _id: {type: GraphQLID},
      major: {type: GraphQLString},
      date: {type: GraphQLString},
      degree: {type: GraphQLString},
      title: {type: GraphQLString}
    };
  }
});

const diagnosisType = new GraphQLObjectType({
  name: 'Diagnosis',
  fields() {
    return {
      id: globalIdField('Diagnosis', ({_id: diagnosisLocalId}) => {
        return diagnosisLocalId;
      }),
      _id: {type: GraphQLID},
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


const interventionType = new GraphQLObjectType({
  name: 'Intervention',
  fields() {
    return {
      id: globalIdField('Intervention', ({_id: interventionLocalId}) => {
        return interventionLocalId;
      }),
      _id: {type: GraphQLID},
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


const evaluationType = new GraphQLObjectType({
  name: 'Evaluation',
  fields() {
    return {
      id: globalIdField('Evaluation', ({_id: evaluationLocalId}) => {
        return evaluationLocalId;
      }),
      _id: {type: GraphQLID},
      major: {type: GraphQLString},
      date: {type: GraphQLString},
      degree: {type: GraphQLString},
      title: {type: GraphQLString}
    };
  }
});