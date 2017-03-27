
'use strict';

import {
  GraphQLEnumType,
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
} from '../functions'



import {ObjectID} from 'mongodb';
import passport from 'passport';
import emailValidator from 'email-validator';
import bcryptjs from 'bcryptjs';
import passwordGenerator from 'password-generator';
import fs from 'fs';
import path from 'path';

//import {userCrudMailSend} from '../mailer';

let _db;
export const profileCollectionName = 'profile';
export const userCollectionName = 'user';


class Viewer extends Object {}
export const viewerGet = () => {
  return Object.assign(
    new Viewer(),
    {
      _id: 'Viewer'
    }
  );
};

class Profile extends Object {}
export const profileGet = (profileLocalId) => {
  return entityGet(profileLocalId, profileCollectionName, _db)
    .then((profile) => {
      return Object.assign(
        new Profile(),
        profile
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
      default:
        return null;
    }
  }
);





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
      region: {type: GraphQLString}
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
      profileId: globalIdField('Profile', ({_profileId: profileLocalId}) => {
        return profileLocalId;
      }),
      _profileId: {type: GraphQLID}
    };
  }
});





export const assessmentType = new GraphQLObjectType({
  name: 'Assessment',
  fields() {
    return {
      id: globalIdField('Assessment', ({_id: assessmentLocalId}) => {
        return assessmentLocalId;
      }),
      _id: {type: GraphQLID},
      term: {
          type: GraphQLString,
          description: 'Nutrition Care Process Terminology (NCPT) assessment term'
      },
      value: {
          type: GraphQLString,
          description: 'Value of assessment term'
      },
      units: {
          type: GraphQLString,
          description: 'Unit of assessment term'
      },
      standard: {
          type: new GraphQLList(assessmentStandardType),
          description: 'Establishes whether value is higher, normal or lower than goal'
      }
    };
  }
});

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
    };
  }
});


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
    };
  }
});


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
    };
  }
});


var assessmentStandardType = new GraphQLEnumType({
  name: 'AssessmentStandard',
  values: {
    HIGH: { 
        value: 0,
        description: 'High/above goal'
    },
    NORMAL: { 
        value: 1,
        description: 'Normal, at goal'
    },
    LOW: { 
        value: 2,
    description: 'Low, below goal'
    }
  }
});


export const diagnosisStatusType = new GraphQLEnumType({
  name: 'DiagnosisStatus',
  values: {
    NEW: { 
        value: 0,
        description: 'New diagnosis'
    },
    CONTINUED: { 
        value: 1,
        description: 'Continued diagnosis'
    },
    RESOLVED: { 
        value: 2,
        description: 'Resolved diagnosis'
    },    
    REMOVED: { 
        value: 3,
        description: 'Removed diagnosis'
    }
  }
});



export const ncptType = new GraphQLObjectType({
  name: 'NCPT',
  fields() {
    return {
      id: {type: GraphQLID},
      term: {
          type: GraphQLString,
          description: ''
      },
      monitoring: {
          type: new GraphQLList(assessmentType),
          description: ''
      },  
    };
  }
});


// var storeType = new GraphQLObjectType({
//   name: 'Store',
//   description: 'A shiny store',
//   fields: () => ({
//     id: globalIdField('Store'),
//     linkConnection: {
//       type: linkConnection.connectionType,
//       args: {
//         ...connectionArgs,
//         query: { type: GraphQLString }
//       },
//       resolve: (obj, args, {mPool}) => {
//         let findParams = {};
//         if (args.query) {
//           findParams.title = new RegExp(args.query, 'i');
//         }
//         return connectionFromPromisedArray(
//           mPool.collection("links")
//             .find(findParams)
//             .sort({createdAt: -1})
//             .limit(args.first).toArray(),
//           args
//       )}
//     }
//   }),
//   interfaces: [nodeInterface],
// });

// var linkType = new GraphQLObjectType({
//   name: 'Link',
//   fields: () => ({
//     //id: globalIdField('Link'),
//     _id: {type: GraphQLString},
//     id: { 
//       type: new GraphQLNonNull(GraphQLID),
//       resolve: (obj)=> obj._id
//     },
//     title: { type: GraphQLString },
//     url: { type: GraphQLString },
//     name: { type: GraphQLString },
//     createdAt: {
//       type: GraphQLString,
//       resolve: (obj) => new Date(obj.createdAt).toISOString()
//     } 
//   }),
// });


// var linkConnection =
//   connectionDefinitions({
//     name: 'Link', 
//     nodeType: linkType
// });

export const patientType = new GraphQLObjectType({
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
      assessment: {
          type: new GraphQLList(assessmentType),
          description: ''
      },
      diagnosis: {
          type: new GraphQLList(diagnosisType), 
          description: ''
      },
      intervention: {
          type: new GraphQLList(interventionType),
          description: ''
      },
      evaluation: {
          type: new GraphQLList(evaluationType),
          description: ''
      },
    //educations: {type: new GraphQLList(educationType)},      
    };
  },
  interfaces: [nodeInterface]
});


export const {
  connectionType: patientConnectionType
} = connectionDefinitions({
  name: 'Patient',
  nodeType: patientType
});





export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields() {
    return {
      id: globalIdField('Viewer', ({_id: viewerLocalId}) => {
        return viewerLocalId;
      }),
      _id: {type: GraphQLID},
      user: {
        type: userType,
        resolve(parent, args, {req: {user}}) {
          return user || {};
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
      }
    };
  },
  interfaces: [nodeInterface]
});