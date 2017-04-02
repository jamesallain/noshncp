'use strict';

import {
  GraphQLSchema,
  GraphQLObjectType, 
} from 'graphql';
import {  
  PatientCreateMutation,    
  PatientUpdateMutation,
  PatientPictureUpdateMutation,
} from './mutations/patient'
import {
  AssessmentCreateMutation,
  AssessmentUpdateMutation,
  AssessmentDeleteMutation,
  DiagnosisCreateMutation,
  DiagnosisUpdateMutation,
  DiagnosisDeleteMutation,
  InterventionCreateMutation,
  InterventionUpdateMutation,
  InterventionDeleteMutation,
  EvaluationCreateMutation,
  EvaluationUpdateMutation,
  EvaluationDeleteMutation,  
} from './mutations/ncp'
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
      
      patientCreate: PatientCreateMutation,
      patientUpdate: PatientUpdateMutation,
      patientPictureUpdate: PatientPictureUpdateMutation,
      assessmentCreate: AssessmentCreateMutation,
      assessmentUpdate: AssessmentUpdateMutation,
      assessmentDelete: AssessmentDeleteMutation,
      diagnosisCreate: DiagnosisCreateMutation,
      diagnosisUpdate: DiagnosisUpdateMutation,
      diagnosisDelete: DiagnosisDeleteMutation,
      interventionCreate: InterventionCreateMutation,
      interventionUpdate: InterventionUpdateMutation,
      interventionDelete: InterventionDeleteMutation,
      evaluationCreate: EvaluationCreateMutation,
      evaluationUpdate: EvaluationUpdateMutation,
      evaluationDelete: EvaluationDeleteMutation,
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