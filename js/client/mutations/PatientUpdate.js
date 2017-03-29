'use strict';

import Relay, {Mutation} from 'react-relay';

export default class PatientUpdateMutation extends Mutation {
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
        patientUpdate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      fullName: this.props.fullName,
      title: this.props.title,
      currentCompany: this.props.currentCompany,
      educationTitle: this.props.educationTitle,
      country: this.props.country,
      region: this.props.region
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PatientUpdatePayload @relay(pattern: true) {
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
