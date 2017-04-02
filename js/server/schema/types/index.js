
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

import {
  patientConnectionType,
  patientType
} from './patientType'

import {
  ncpConnectionType,
  ncpType
} from './ncpType'

let _db;
const userCollectionName = 'user';
const profileCollectionName = 'profile';
const patientCollectionName = 'patient';
const ncpCollectionName = 'ncp';


export class Viewer extends Object {}
export const viewerGet = () => {
  return Object.assign(
    new Viewer(),
    {
      _id: 'Viewer'
    }
  );
};

export class Profile extends Object {}
export const profileGet = (profileLocalId) => {
  return entityGet(profileLocalId, profileCollectionName, _db)
    .then((profile) => {
      return Object.assign(
        new Profile(),
        profile
      );
    });
};

export class Patient extends Object {}
export const patientGet = (patientLocalId) => {
  return entityGet(patientLocalId, patientCollectionName, _db)
    .then((patient) => {
      return Object.assign(
        new Patient(),
        patient
      );
    });
};

class Ncp extends Object {}
export const ncpGet = (ncpLocalId) => {
  return entityGet(ncpLocalId, ncpCollectionName, _db)
    .then((ncp) => {
      return Object.assign(
        new Ncp(),
        ncp
      );
    });
};


export const {
  nodeInterface,
  nodeField
} = nodeDefinitions(
  (globalId) => {
    const {id: localId, type} = fromGlobalId(globalId);
    switch (type) {
      case 'Viewer':
        return viewerGet(localId); 
      case 'Profile':
        return profileGet(localId);
        // return profileGet(
        //   {_id: new ObjectID(localId)},
        //   profileCollectionName,
        //   _db
        // );
    case 'Patient':
        return patientGet(localId);        
        // return patientGet(
        //   {_id: new ObjectID(localId)},
        //   patientCollectionName,
        //   _db
        // );
    case 'Ncp':
        return ncpGet(localId);        
        // return patientGet(
        //   {_id: new ObjectID(localId)},
        //   patientCollectionName,
        //   _db
        // );
      default:
        return null;
    }
  },
  (obj) => {
    switch (true) {
      case (obj instanceof Viewer):
        return viewerType;
      case (obj instanceof Profile):
        return profileType;  
      case (obj instanceof Patient):
        return patientType;
      case (obj instanceof Ncp):
        return ncpType; 
      default:
        return null;
    }
  }
);

//Start types--------------------------------------------------------------

export const languageType = new GraphQLObjectType({
  name: 'Language',
  fields() {
    return {
      language: {type: GraphQLString},
      level: {type: GraphQLString}
    };
  }
});

export const skillType = new GraphQLObjectType({
  name: 'Skill',
  fields() {
    return {
      id: globalIdField('Skill', ({_id: skillLocalId}) => {
        return skillLocalId;
      }),
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      recommendations: {type: GraphQLString}
    };
  }
});

export const experienceType = new GraphQLObjectType({
  name: 'Experience',
  fields() {
    return {
      id: globalIdField('Experience', ({_id: experienceLocalId}) => {
        return experienceLocalId;
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

export const educationType = new GraphQLObjectType({
  name: 'Education',
  fields() {
    return {
      id: globalIdField('Education', ({_id: educationLocalId}) => {
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

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields() {
    return {
      id: globalIdField('Profile', ({_id: profileLocalId}) => {
        return profileLocalId;
      }),
      _id: {type: GraphQLID},
      fullName: {type: GraphQLString},
      industry: {type: GraphQLString},
      languages: {type: new GraphQLList(languageType)},
      previousCompanies: {type: new GraphQLList(GraphQLString)},
      profilePicture: {type: GraphQLString},
      skills: {type: new GraphQLList(skillType)},
      title: {type: GraphQLString},
      experiences: {type: new GraphQLList(experienceType)},
      educations: {type: new GraphQLList(educationType)},
      currentCompany: {type: GraphQLString},
      educationTitle: {type: GraphQLString},
      country: {type: GraphQLString},
      region: {type: GraphQLString},
      assessments: {
          type: new GraphQLList(assessmentType),
          description: ''
      },
      diagnoses: {
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

    };
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: profileConnectionType
} = connectionDefinitions({
  name: 'Profile',
  nodeType: profileType
});

export const userType = new GraphQLObjectType({
  name: 'User',
  fields() {
    return {
      id: globalIdField('User', ({_id: userLocalId}) => {
        return userLocalId;
      }),
      _id: {type: GraphQLID},
      email: {type: GraphQLString},
      password: {type: GraphQLString},

      patientId: globalIdField('Patient', ({_patientId: patientLocalId}) => {
        return patientLocalId;
      }),      
      _patientId: {type: GraphQLID},
      
      profileId: globalIdField('Profile', ({_profileId: profileLocalId}) => {
        return profileLocalId;
      }),
      _profileId: {type: GraphQLID},
     
    };
  }
});

export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields() {
    return {

      id: globalIdField('Viewer', ({_id: viewerLocalId}) => {
        console.log("viewer local id:", viewerLocalId)
        return viewerLocalId;
      }),
      _id: {type: GraphQLID},
      user: {
        type: userType,
        resolve(parent, args, {req: {user}}) {
          return user || {};
        }
      },

      patient: {
        type: patientConnectionType,
        args: {
          id: {type: GraphQLID},
          searchTerm: {type: GraphQLString},
          ...connectionArgs
        },
        resolve(parent, {id: patientGlobalId, searchTerm, ...connectionArgs}, {db}) {
          console.log("patient server global id:+++++++++++++++++++++++++", patientGlobalId)
          const query = (() => {
            const q = {};
            if (patientGlobalId) {
              const {id: patientLocalId} = fromGlobalId(patientGlobalId);

              Object.assign(
                q,
                {_id: new ObjectID(patientLocalId)}
              );
            }

            if (searchTerm) {
              Object.assign(
                q,
                {
                  $text: {
                    $search: `\"${searchTerm}\"`
                  }
                }
              );
            }

            return q;
          })();
          const sort = {_id: -1};
          const limit = 0;

          return connectionFromPromisedArray(
            promisedArrayGet(
              query,
              sort,
              limit,
              patientCollectionName,
              db
            ),
            connectionArgs
          );
        }
      },
      
      ncp: {
        type: ncpConnectionType,
        args: {
          id: {type: GraphQLID},
          searchTerm: {type: GraphQLString},
          ...connectionArgs
          
        },
        resolve(parent, {id: ncpGlobalId, searchTerm, ...connectionArgs}, {db}) {
          console.log("ncp server global id:+++++++++++++++++++++++++", ncpGlobalId)
          const query = (() => {
            const q = {};
            if (ncpGlobalId) {
              const {id: ncpLocalId} = fromGlobalId(ncpGlobalId);

              Object.assign(
                q,
                {_id: new ObjectID(ncpLocalId)}
              );
            }

            if (searchTerm) {
              Object.assign(
                q,
                {
                  $text: {
                    $search: `\"${searchTerm}\"`
                  }
                }
              );
            }

            return q;
          })();
          const sort = {_id: -1};
          const limit = 0;

          return connectionFromPromisedArray(
            promisedArrayGet(
              query,
              sort,
              limit,
              ncpCollectionName,
              db
            ),
            connectionArgs
          );
        }
      },
     
      profile: {
        type: profileConnectionType,
        args: {
          id: {type: GraphQLID},
          searchTerm: {type: GraphQLString},
          ...connectionArgs
        },
        resolve(parent, {id: profileGlobalId, searchTerm, ...connectionArgs}, {db}) {
          console.log("profile server global id:----------------------------", profileGlobalId)
          const query = (() => {
            const q = {};
            if (profileGlobalId) {
              const {id: profileLocalId} = fromGlobalId(profileGlobalId);

              Object.assign(
                q,
                {_id: new ObjectID(profileLocalId)}
              );
            }

            if (searchTerm) {
              Object.assign(
                q,
                {
                  $text: {
                    $search: `\"${searchTerm}\"`
                  }
                }
              );
            }

            return q;
          })();
          const sort = {_id: -1};
          const limit = 0;

          return connectionFromPromisedArray(
            promisedArrayGet(
              query,
              sort,
              limit,
              profileCollectionName,
              db
            ),
            connectionArgs
          );
        }
      },
     
    };
  },
  interfaces: [nodeInterface]
});