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
  isPatientCreatorCheck
} from '../../functions'
import {
  viewerGet,
  patientGet,
  languageType,
  interventionType,
  assessmentType,
  diagnosisType,
  evaluationType,
  patientType,
  userType,    
  assessmentStandardType,
  diagnosisStatusType,
  viewerType
} from '../../types'



import {ObjectID} from 'mongodb';
//For PatientPictureUpdateMutation
import fs from 'fs';
import path from 'path';

const patientCollectionName = 'patient';

export const PatientPictureUpdateMutation = mutationWithClientMutationId({
  name: 'PatientPictureUpdate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: patientGlobalId}, {db, req}) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }
    console.log("local: ", patientLocalId)
    console.log("global: ", patientGlobalId)
    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return fs.writeFile(
        path.join(process.cwd(), 'media', patientLocalId),
        req.file.buffer,
        () => {
          return resolve(null);
        }
      );
    })

    .then(() => {
      return new Promise((resolve) => {
        return db.collection(patientCollectionName)
          .findAndModify(
            {_id: new ObjectID(patientLocalId)},
            [],
            ({
              $set: {
                patientPicture: `/${patientLocalId}`
              }
            }),
            ({
              new: true
            }),
            (err, {value: patient}) => {
              return resolve(patient);
            }
          );
      });
    });
  }
});

export const PatientUpdateMutation = mutationWithClientMutationId({
  name: 'PatientUpdate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: patientGlobalId,
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
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
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});


export const PatientAssessmentCreateMutation = mutationWithClientMutationId({
  name: 'PatientAssessmentCreate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, company, title, description, country, region, since, until},
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $push: {
              assessments: {
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
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientAssessmentUpdateMutation = mutationWithClientMutationId({
  name: 'PatientAssessmentUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    assessmentId: {type: new GraphQLNonNull(GraphQLID)},
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: patientGlobalId,
      assessmentId: assessmentGlobalId,
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: assessmentLocalId} = fromGlobalId(assessmentGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(patientLocalId),
            'assessments._id': new ObjectID(assessmentLocalId)
          }),
          [],
          ({
            $set: {
              'assessments.$.company': company,
              'assessments.$.title': title,
              'assessments.$.country': country,
              'assessments.$.region': region,
              'assessments.$.since': since,
              'assessments.$.until': until,
              'assessments.$.description': description
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientAssessmentDeleteMutation = mutationWithClientMutationId({
  name: 'PatientAssessmentDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    assessmentId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, assessmentId: assessmentGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: assessmentLocalId} = fromGlobalId(assessmentGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $pull: {
              assessments: {
                _id: new ObjectID(assessmentLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientDiagnosisCreateMutation = mutationWithClientMutationId({
  name: 'PatientDiagnosisCreate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload({id: patientGlobalId, date, degree, title}, {db, req}) {

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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $push: {
              diagnosiss: {
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
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientDiagnosisUpdateMutation = mutationWithClientMutationId({
  name: 'PatientDiagnosisUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    diagnosisId: {type: new GraphQLNonNull(GraphQLID)},
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, diagnosisId: diagnosisGlobalId, date, degree, title},
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: diagnosisLocalId} = fromGlobalId(diagnosisGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(patientLocalId),
            'diagnosiss._id': new ObjectID(diagnosisLocalId)
          }),
          [],
          ({
            $set: {
              'diagnosiss.$.date': date,
              'diagnosiss.$.degree': degree,
              'diagnosiss.$.title': title
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientDiagnosisDeleteMutation = mutationWithClientMutationId({
  name: 'PatientDiagnosisDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    diagnosisId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, diagnosisId: diagnosisGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: diagnosisLocalId} = fromGlobalId(diagnosisGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $pull: {
              diagnosiss: {
                _id: new ObjectID(diagnosisLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientInterventionCreateMutation = mutationWithClientMutationId({
  name: 'PatientInterventionCreate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, company, title, description, country, region, since, until},
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $push: {
              interventions: {
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
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientInterventionUpdateMutation = mutationWithClientMutationId({
  name: 'PatientInterventionUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    interventionId: {type: new GraphQLNonNull(GraphQLID)},
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: patientGlobalId,
      interventionId: interventionGlobalId,
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: interventionLocalId} = fromGlobalId(interventionGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(patientLocalId),
            'interventions._id': new ObjectID(interventionLocalId)
          }),
          [],
          ({
            $set: {
              'interventions.$.company': company,
              'interventions.$.title': title,
              'interventions.$.country': country,
              'interventions.$.region': region,
              'interventions.$.since': since,
              'interventions.$.until': until,
              'interventions.$.description': description
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientInterventionDeleteMutation = mutationWithClientMutationId({
  name: 'PatientInterventionDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    interventionId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, interventionId: interventionGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: interventionLocalId} = fromGlobalId(interventionGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $pull: {
              interventions: {
                _id: new ObjectID(interventionLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});


export const PatientEvaluationCreateMutation = mutationWithClientMutationId({
  name: 'PatientEvaluationCreate',
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, company, title, description, country, region, since, until},
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $push: {
              evaluations: {
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
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientEvaluationUpdateMutation = mutationWithClientMutationId({
  name: 'PatientEvaluationUpdate',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    evaluationId: {type: new GraphQLNonNull(GraphQLID)},
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
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {
      id: patientGlobalId,
      evaluationId: evaluationGlobalId,
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
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: evaluationLocalId} = fromGlobalId(evaluationGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          ({
            _id: new ObjectID(patientLocalId),
            'evaluations._id': new ObjectID(evaluationLocalId)
          }),
          [],
          ({
            $set: {
              'evaluations.$.company': company,
              'evaluations.$.title': title,
              'evaluations.$.country': country,
              'evaluations.$.region': region,
              'evaluations.$.since': since,
              'evaluations.$.until': until,
              'evaluations.$.description': description
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

export const PatientEvaluationDeleteMutation = mutationWithClientMutationId({
  name: 'PatientEvaluationDelete',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    evaluationId: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve() {
        return viewerGet();
      }
    },
    field: {
      type: patientType,
      resolve(node) {
        return node;
      }
    }
  },
  mutateAndGetPayload(
    {id: patientGlobalId, evaluationId: evaluationGlobalId},
    {db, req}
  ) {

    let err;
    if ((err = isSignedinCheck(req))) {
      return new GraphQLError(err);
    }
    if ((err = isPatientCreatorCheck(patientGlobalId, req.user._patientId))) {
      return new GraphQLError(err);
    }

    const {id: patientLocalId} = fromGlobalId(patientGlobalId);
    const {id: evaluationLocalId} = fromGlobalId(evaluationGlobalId);

    return new Promise((resolve) => {
      return db.collection(patientCollectionName)
        .findAndModify(
          {_id: new ObjectID(patientLocalId)},
          [],
          ({
            $pull: {
              evaluations: {
                _id: new ObjectID(evaluationLocalId)
              }
            }
          }),
          ({
            new: true
          }),
          (err, {value: patient}) => {
            return resolve(patient);
          }
        );
    });
  }
});

