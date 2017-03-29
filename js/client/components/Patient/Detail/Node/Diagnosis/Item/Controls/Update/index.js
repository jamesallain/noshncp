'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Update extends Component {
  render() {
    return (
      <button
        className = 'Update btn btn-link btn-sm'
        onClick = {this.props.onUpdateTrigger}
      >
        <i className = 'fa fa-pencil'></i>
      </button>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Diagnosis {
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
  }
});
