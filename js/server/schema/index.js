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
  isCreatorCheck
} from './functions'
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
    languageType,
    skillType,
    experienceType,
    educationType,
    profileType,
    userType,
    patientType,
    assessmentType,
    diagnosisType,
    interventionType,
    evaluationType,
    assessmentStandardType,
    diagnosisStatusType,
    viewerType
} from './types'

// import {
//     Viewer,
//     Profile,
//     viewerGet,
//     profileGet,
//     nodeInterface,
//     nodeField
// } from './node'


import {ObjectID} from 'mongodb';
import passport from 'passport';
import emailValidator from 'email-validator';
import bcryptjs from 'bcryptjs';
import passwordGenerator from 'password-generator';
import fs from 'fs';
import path from 'path';

import {userCrudMailSend} from '../mailer';

let _db;
const profileCollectionName = 'profile';
const userCollectionName = 'user';


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
      profilePictureUpdate: ProfilePictureUpdateMutation
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