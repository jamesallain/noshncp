'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import PatientPicture from './PatientPicture';
import Text from './Text';

class Jumbotron extends Component {
  patientPictureRender() {
    return (
      <PatientPicture
        node = {this.props.node}
        viewer = {this.props.viewer}
      />
    );
  }
  textRender() {
    return (
      <Text
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
      <div className = 'Jumbotron jumbotron'>
        {this.patientPictureRender()}
        <br/>
        {this.textRender()}
      </div>
    );
  }
}

export default createContainer(Jumbotron, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientPicture.getFragment('node')},
          ${Text.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Text.getFragment('viewer')},
          ${PatientPicture.getFragment('viewer')}
        }
      `;
    }
  }
});
