'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import PatientEvaluationDeleteMutation from 'mutations/PatientEvaluationDelete';

class Delete extends Component {
  state = {};
  patientEvaluationDelete = () => {
    this.props.relay.commitUpdate(
      new PatientEvaluationDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.patientEvaluationDelete();
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
        fragment on Evaluation {
          ${PatientEvaluationDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientEvaluationDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${PatientEvaluationDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
