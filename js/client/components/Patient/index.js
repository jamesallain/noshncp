'use strict';

import React, {Component, cloneElement} from 'react';
import Relay, {createContainer} from 'react-relay';

import Edges from './Edges';
import Detail from './Detail';

class Patient extends Component {
  render() {
    console.log("Patient component",this.props)
    return (
      <div className = 'Patient'>
        {
          cloneElement(
            this.props.children,
            {
              viewer: this.props.viewer,
              searchTermInput: this.props.searchTermInput
            }
          )
        }
      </div>
    );
  }
}

export default createContainer(Patient, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Edges.getFragment('viewer')},
          ${Detail.getFragment('viewer')}
        }
      `;
    }
  }
});
