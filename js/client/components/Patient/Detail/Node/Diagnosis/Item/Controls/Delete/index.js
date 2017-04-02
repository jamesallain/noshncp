'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import DiagnosisDeleteMutation from 'mutations/DiagnosisDelete';

class Delete extends Component {
  state = {};
  diagnosisDelete = () => {
    this.props.relay.commitUpdate(
      new DiagnosisDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.diagnosisDelete();
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
          ${DiagnosisDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${DiagnosisDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${DiagnosisDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
