'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import EvaluationDeleteMutation from 'mutations/EvaluationDelete';

class Delete extends Component {
  state = {};
  evaluationDelete = () => {
    this.props.relay.commitUpdate(
      new EvaluationDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.evaluationDelete();
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
          ${EvaluationDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${EvaluationDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${EvaluationDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
