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
    //   standard: {
    //       type: new GraphQLList(assessmentStandardType),
    //       description: 'Establishes whether value is higher, normal or lower than goal'
    //   },
      major: {type: GraphQLString},
      date: {type: GraphQLString},
      degree: {type: GraphQLString},
      title: {type: GraphQLString}
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




// const commentType = new GraphQLObjectType({
//   name: 'Comment',
//   fields() {
//     return {
//       id: globalIdField('Comment', ({_id: commentLocalId}) => {
//         return commentLocalId;
//       }),
//       _id: {type: GraphQLID},
//       _postId: {type: GraphQLID},
//       text: {type: GraphQLString}
//     };
//   }
// });

// const {
//   connectionType: commentConnectionType,
//   edgeType: commentEdgeType
// } = connectionDefinitions({
//   name: 'Comment',
//   nodeType: commentType
// });

// const postType = new GraphQLObjectType({
//   name: 'Post',
//   fields() {
//     return {
//       id: globalIdField('Post', ({_id: postLocalId}) => {
//         return postLocalId;
//       }),
//       _id: {type: GraphQLID},
//       text: {type: GraphQLString},
//       comment: {
//         type: commentConnectionType,
//         args: {
//           ...connectionArgs
//         },
//         resolve({_id: postLocalId}, {...connectionArgs}, {db}) {
//           return connectionFromPromisedArray(
//             promisedArrayGet(
//               (() => {
//                 let q = {_postId: new ObjectID(postLocalId)};

//                 return q;
//               })(),
//               {_id: 1},
//               commentCollectionName,
//               db
//             ),
//             connectionArgs
//           );
//         }
//       }
//     };
//   },
//   interfaces: [nodeInterface]
// });

// const {
//   connectionType: postConnectionType,
//   edgeType: postEdgeType
// } = connectionDefinitions({
//   name: 'Post',
//   nodeType: postType
// });