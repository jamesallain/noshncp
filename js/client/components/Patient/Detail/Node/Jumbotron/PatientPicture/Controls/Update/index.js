'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import PatientPictureUpdateMutation from 'mutations/PatientPictureUpdate';

class Update extends Component {
  state = {
    file: null
  };
  patientPictureUpdate = () => {
    this.props.relay.commitUpdate(
      new PatientPictureUpdateMutation({
        file: this.state.file,
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onSuccess: () => {
          this.props.onUpdateSuccess();
        }
      }
    );
  };
  onChangeHandle = () => {
    this.setState(
      {file: this.refs.patientPictureInput.files[0]},
      () => {
        this.patientPictureUpdate();
      }
    );
  };
  render() {
    return (
      <div className = 'Update'>
        <label htmlFor = 'patientPictureInput'>
          <i className = 'fa fa-pencil btn btn-link fa-lg'></i>
        </label>
        <input
          type = 'file'
          name = 'file'
          id = 'patientPictureInput'
          ref = 'patientPictureInput'
          className = 'btn btn-link btn-lg'
          onChange = {this.onChangeHandle}
        />
      </div>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientPictureUpdateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${PatientPictureUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
