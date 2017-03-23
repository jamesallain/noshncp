'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileEducationDeleteMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Education {
          id
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
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
        profileEducationDelete
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      educationId: this.props.item.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ProfileEducationDeletePayload @relay(pattern: true) {
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
