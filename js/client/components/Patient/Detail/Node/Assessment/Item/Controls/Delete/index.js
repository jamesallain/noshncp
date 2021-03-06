'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import AssessmentDeleteMutation from 'mutations/AssessmentDelete';

class Delete extends Component {
  state = {};
  assessmentDelete = () => {
    this.props.relay.commitUpdate(
      new AssessmentDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.assessmentDelete();
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
          ${AssessmentDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${AssessmentDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${AssessmentDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
