'use strict';

import Relay, {Mutation} from 'react-relay';

export default class EvaluationDeleteMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Evaluation {
          id
        }
      `;
    },
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
        evaluationDelete
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      evaluationId: this.props.item.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EvaluationDeletePayload @relay(pattern: true) {
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
