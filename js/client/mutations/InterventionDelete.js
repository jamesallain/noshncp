'use strict';

import Relay, {Mutation} from 'react-relay';

export default class InterventionDeleteMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Intervention {
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
        interventionDelete
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      interventionId: this.props.item.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on InterventionDeletePayload @relay(pattern: true) {
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
