'use strict';

import Relay, {Mutation} from 'react-relay';

export default class PatientPictureUpdateMutation extends Mutation {
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
        patientPictureUpdate
      }
    `;
  }
  getFiles() {
    return {
      file: this.props.file
    };
  }
  getVariables() {
    return {
      id: this.props.node.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PatientPictureUpdatePayload @relay(pattern: true) {
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
