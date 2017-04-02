'use strict';

import Relay, {Mutation} from 'react-relay';

export default class EvaluationCreateMutation extends Mutation {
  static fragments = {
    node() {
      return Relay.QL`
        fragment on Patient {
          id
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          id
        }
      `;
    }
  };
  getMutation() {
    return Relay.QL`
      mutation {
        evaluationCreate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      date: this.props.date,
      degree: this.props.degree,
      title: this.props.title
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EvaluationCreatePayload @relay(pattern: true) {
        viewer,
        field
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
          field: this.props.node.id
        }
      }
    ];
  }
}
