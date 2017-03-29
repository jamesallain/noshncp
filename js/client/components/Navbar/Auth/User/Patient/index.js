'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {Link} from 'react-router';

class Patient extends Component {
  render() {
    return (
      <li className = 'nav-item'>
        <Link
          className = 'nav-link'
          to = {`/Patient/${this.props.user.patientId}`}
        >
          Patient
        </Link>
        <p>
          {this.props.user.email}
        </p>
      </li>
    );
  }
}

export default createContainer(Patient, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          email,
          patientId
        }
      `;
    }
  }
});
