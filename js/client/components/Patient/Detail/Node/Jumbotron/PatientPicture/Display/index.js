'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Display extends Component {
  render() {
    return (
      <img
        ref = 'patientPicture'
        src = {
          (this.props.node.patientPicture) ?
            `${this.props.node.patientPicture}?${new Date().getTime()}` :
            '/unknown_user.jpg'
        }
        className = 'Display rounded'
        alt=""
      />
    );
  }
}

export default createContainer(Display, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          patientPicture
        }
      `;
    }
  }
});
