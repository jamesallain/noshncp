'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import PatientDiagnosisDeleteMutation from 'mutations/PatientDiagnosisDelete';

class Delete extends Component {
  state = {};
  patientDiagnosisDelete = () => {
    this.props.relay.commitUpdate(
      new PatientDiagnosisDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.patientDiagnosisDelete();
  };
  render() {
    return (
      <button
        className = 'Delete btn btn-link btn-sm'
        onClick = {this.onClickHandle}
      >
        <i className = 'fa fa-times'></i>
      </button>
    );
  }
}

export default createContainer(Delete, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Diagnosis {
          ${PatientDiagnosisDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientDiagnosisDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${PatientDiagnosisDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
