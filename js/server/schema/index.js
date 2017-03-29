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
import {      
  PatientUpdateMutation,
  PatientAssessmentCreateMutation,
  PatientAssessmentUpdateMutation,
  PatientAssessmentDeleteMutation,
  PatientDiagnosisCreateMutation,
  PatientDiagnosisUpdateMutation,
  PatientDiagnosisDeleteMutation,
  PatientInterventionCreateMutation,
  PatientInterventionUpdateMutation,
  PatientInterventionDeleteMutation,
  PatientEvaluationCreateMutation,
  PatientEvaluationUpdateMutation,
  PatientEvaluationDeleteMutation,
  PatientPictureUpdateMutation
} from './mutations/patient'
import {      
  ProfileUpdateMutation,
  ProfileExperienceCreateMutation,
  ProfileExperienceUpdateMutation,
  ProfileExperienceDeleteMutation,
  ProfileEducationCreateMutation,
  ProfileEducationUpdateMutation,
  ProfileEducationDeleteMutation,
  ProfileSkillCreateMutation,
  ProfileSkillUpdateMutation,
  ProfileSkillDeleteMutation,
  ProfilePictureUpdateMutation
} from './mutations/profile'
import {
  UserCreateMutation,
  UserUpdateMutation,
  UserDeleteMutation,
  UserSigninMutation,
  UserSignoutMutation,
  UserPasswordResetMutation,      
} from './mutations/user'
import {
  viewerGet,
  profileGet,
  nodeInterface,
  nodeField,  
  viewerType
} from './types'

let _db;

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields() {
    return {
      node: nodeField,
      viewer: {
        type: viewerType,
        resolve() {
          return viewerGet();
        }
      }
    };
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields() {
    return {
      userCreate: UserCreateMutation,
      userUpdate: UserUpdateMutation,
      userDelete: UserDeleteMutation,
      userSignin: UserSigninMutation,
      userSignout: UserSignoutMutation,
      userPasswordReset: UserPasswordResetMutation,
      profileUpdate: ProfileUpdateMutation,
      profileExperienceCreate: ProfileExperienceCreateMutation,
      profileExperienceUpdate: ProfileExperienceUpdateMutation,
      profileExperienceDelete: ProfileExperienceDeleteMutation,
      profileEducationCreate: ProfileEducationCreateMutation,
      profileEducationUpdate: ProfileEducationUpdateMutation,
      profileEducationDelete: ProfileEducationDeleteMutation,
      profileSkillCreate: ProfileSkillCreateMutation,
      profileSkillUpdate: ProfileSkillUpdateMutation,
      profileSkillDelete: ProfileSkillDeleteMutation,
      profilePictureUpdate: ProfilePictureUpdateMutation,
      
      patientUpdate: PatientUpdateMutation,
      patientAssessmentCreate: PatientAssessmentCreateMutation,
      patientAssessmentUpdate: PatientAssessmentUpdateMutation,
      patientAssessmentDelete: PatientAssessmentDeleteMutation,
      patientDiagnosisCreate: PatientDiagnosisCreateMutation,
      patientDiagnosisUpdate: PatientDiagnosisUpdateMutation,
      patientDiagnosisDelete: PatientDiagnosisDeleteMutation,
      patientInterventionCreate: PatientInterventionCreateMutation,
      patientInterventionUpdate: PatientInterventionUpdateMutation,
      patientInterventionDelete: PatientInterventionDeleteMutation,
      patientEvaluationCreate: PatientEvaluationCreateMutation,
      patientEvaluationUpdate: PatientEvaluationUpdateMutation,
      patientEvaluationDelete: PatientEvaluationDeleteMutation,
      patientPictureUpdate: PatientPictureUpdateMutation
    };
  }
});

const schemaType = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

const schemaGet = (db) => {
  _db = db;

  return schemaType;
};

export {
  schemaGet
};