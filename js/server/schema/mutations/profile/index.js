'use strict';

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError
} from 'graphql';
import {  
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';
import {  
  inputPresentCheck,  
  isSignedinCheck,
  isProfileCreatorCheck
} from '../../functions'
import {
    viewerGet,
    profileGet, 
    profileType,   
    viewerType
} from '../../types'

import {ObjectID} from 'mongodb';
//For ProfilePictureUpdateMutation
import fs from 'fs';
import path from 'path';

const profileCollectionName = 'profile';

export const ProfileUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    fullName: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    currentCompany: {type: new GraphQLNonNull(GraphQLString)},
    educationTitle: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: profileGlobalId,
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      fullName,
      title,
      currentCompany,
      educationTitle,
      country,
      region
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $set: {
              fullName,
              title,
              currentCompany,
              educationTitle,
              country,
              region
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileExperienceCreateMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    company: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    since: {type: new GraphQLNonNull(GraphQLString)},
    until: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, company, title, description, country, region, since, until},
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      company,
      title,
      country,
      region,
      since,
      until,
      description
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              experiences: {
                $each: [{
                  _id: new ObjectID(),
                  company,
                  title,
                  description,
                  country,
                  region,
                  since,
                  until
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileExperienceUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    experienceId: {type: new GraphQLNonNull(GraphQLID)},
    company: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    since: {type: new GraphQLNonNull(GraphQLString)},
    until: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: profileGlobalId,
      experienceId: experienceGlobalId,
      company,
      title,
      description,
      country,
      region,
      since,
      until
    },
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      company,
      title,
      country,
      region,
      since,
      until,
      description
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: experienceLocalId} = fromGlobalId(experienceGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'experiences._id': new ObjectID(experienceLocalId)
          }),
          [],
          ({
            $set: {
              'experiences.$.company': company,
              'experiences.$.title': title,
              'experiences.$.country': country,
              'experiences.$.region': region,
              'experiences.$.since': since,
              'experiences.$.until': until,
              'experiences.$.description': description
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileExperienceDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileExperienceDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    experienceId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, experienceId: experienceGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: experienceLocalId} = fromGlobalId(experienceGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              experiences: {
                _id: new ObjectID(experienceLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileEducationCreateMutation = mutationWithClientMutationId({
  name: 'ProfileEducationCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLString)},
    date: {type: new GraphQLNonNull(GraphQLString)},
    degree: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, date, degree, title}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({
      date,
      degree,
      title
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              educations: {
                $each: [{
                  _id: new ObjectID(),
                  date,
                  degree,
                  title
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileEducationUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileEducationUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    educationId: {type: new GraphQLNonNull(GraphQLID)},
    date: {type: new GraphQLNonNull(GraphQLString)},
    degree: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, educationId: educationGlobalId, date, degree, title},
    {db, req}
  ) {

    let err;
    if ((err = inputPresentCheck({
      date,
      degree,
      title
    }))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: educationLocalId} = fromGlobalId(educationGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'educations._id': new ObjectID(educationLocalId)
          }),
          [],
          ({
            $set: {
              'educations.$.date': date,
              'educations.$.degree': degree,
              'educations.$.title': title
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileEducationDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileEducationDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    educationId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: profileGlobalId, educationId: educationGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: educationLocalId} = fromGlobalId(educationGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              educations: {
                _id: new ObjectID(educationLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileSkillCreateMutation = mutationWithClientMutationId({
  name: 'ProfileSkillCreate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, name}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({name}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $push: {
              skills: {
                $each: [{
                  _id: new ObjectID(),
                  name
                }],
                $position: 0
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileSkillUpdateMutation = mutationWithClientMutationId({
  name: 'ProfileSkillUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    skillId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, skillId: skillGlobalId, name}, {db, req}) {

    let err;
    if ((err = inputPresentCheck({name}))) {
      return new GraphQLError(err);
    }
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: skillLocalId} = fromGlobalId(skillGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(profileLocalId),
            'skills._id': new ObjectID(skillLocalId)
          }),
          [],
          ({
            $set: {
              'skills.$.name': name
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfileSkillDeleteMutation = mutationWithClientMutationId({
  name: 'ProfileSkillDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    skillId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId, skillId: skillGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);
    const {id: skillLocalId} = fromGlobalId(skillGlobalId);

    return new Promise((resolve) => {
      return db.collection(profileCollectionName)
        .findAndModify(
          {_id: new ObjectID(profileLocalId)},
          [],
          ({
            $pull: {
              skills: {
                _id: new ObjectID(skillLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: profile}) => {
            return resolve(profile);
          }
        );
    });
  }
});

export const ProfilePictureUpdateMutation = mutationWithClientMutationId({
  name: 'ProfilePictureUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    file: {type: GraphQLString}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: profileType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: profileGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isProfileCreatorCheck(profileGlobalId, req.user._profileId))) {
      return new GraphQLError(err);
    }

    const {id: profileLocalId} = fromGlobalId(profileGlobalId);

    return new Promise((resolve) => {
      return fs.writeFile(
        path.join(process.cwd(), 'media', profileLocalId),
        req.file.buffer,
        () => {
          return resolve(null);
        }
      );
    })

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(profileCollectionName)
          .findAndModify(
            {_id: new ObjectID(profileLocalId)},
            [],
            ({
              $set: {
                profilePicture: `/${profileLocalId}`
              }
            }),
            ({
              new: true
            }),
            (err, {value: profile}) => {
              return resolve(profile);
            }
          );
      });
    });
  }
});