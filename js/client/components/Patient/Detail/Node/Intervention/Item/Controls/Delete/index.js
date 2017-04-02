'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import InterventionDeleteMutation from 'mutations/InterventionDelete';

class Delete extends Component {
  state = {};
  interventionDelete = () => {
    this.props.relay.commitUpdate(
      new InterventionDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.interventionDelete();
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
        fragment on Intervention {
          ${InterventionDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${InterventionDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${InterventionDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
