'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import PatientAssessmentDeleteMutation from 'mutations/PatientAssessmentDelete';

class Delete extends Component {
  state = {};
  patientAssessmentDelete = () => {
    this.props.relay.commitUpdate(
      new PatientAssessmentDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.patientAssessmentDelete();
  };
  render() {
    return (
      <button
        className = 'btn btn-link btn-sm'
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
        fragment on Assessment {
          ${PatientAssessmentDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientAssessmentDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${PatientAssessmentDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
