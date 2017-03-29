'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Controls from './Controls';
import Display from './Display';
import Update from './Update';

class Text extends Component {
  state = {
    updateRequired: false,
    updateTriggered: false
  };
  componentWillReceiveProps(nextProps) {
    this.setState({updateRequired: updateRequiredGet(nextProps)});
  }
  controlsRender() {
    return (!this.state.updateRequired &&
      !this.state.updateTriggered) &&
      <Controls
        onUpdateTrigger = {this.onUpdateTriggerHandle}
      />;
  }
  onUpdateTriggerHandle = () => {
    this.setState({updateTriggered: true});
  };
  onPatientUpdateSuccessHandle = () => {
    this.setState({
      updateRequired: false,
      updateTriggered: false
    });
  };
  onPatientUpdateCancelHandle = () => {
    this.setState({
      updateTriggered: false
    });
  };
  textRender() {
    return ((this.state.updateRequired ||
      this.state.updateTriggered)) ?
      <Update
        node = {this.props.node}
        viewer = {this.props.viewer}
        updateRequired = {this.state.updateRequired}
        updateTriggered = {this.state.updateTriggered}
        onPatientUpdateSuccess = {this.onPatientUpdateSuccessHandle}
        onPatientUpdateCancel = {this.onPatientUpdateCancelHandle}
      /> :
      <Display
        node = {this.props.node}
      />;
  }
  render() {
    return (
      <div className = 'Text text-center text-muted'>
        {this.controlsRender()}
        {this.textRender()}
      </div>
    );
  }
}

export default createContainer(Text, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          fullName,
          title,
          currentCompany,
          educationTitle,
          country,
          region,
          ${Display.getFragment('node')},
          ${Update.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Update.getFragment('viewer')}
        }
      `;
    }
  }
});

const updateRequiredGet = (props) => {
  return (props.node.fullName) ?
    false :
    true;
};
