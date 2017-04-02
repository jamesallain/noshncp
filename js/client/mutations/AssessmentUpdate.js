'use strict';

import Relay, {Mutation} from 'react-relay';

export default class AssessmentUpdateMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Assessment {
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
        assessmentUpdate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      assessmentId: this.props.item.id,
      date: this.props.date,
      degree: this.props.degree,
      title: this.props.title
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AssessmentUpdatePayload @relay(pattern: true) {
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
