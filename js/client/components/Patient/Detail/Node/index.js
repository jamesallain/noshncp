'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Jumbotron from './Jumbotron';
import Assessment from './Assessment';
import Diagnosis from './Diagnosis';
import Intervention from './Intervention';
import Evaluation from './Evaluation';


class Node extends Component {
  jumbotronRender() {
    return (
      <Jumbotron
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  assessmentRender() {
    return (
      <Assessment
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  diagnosisRender() {
    return (
      <Diagnosis
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }  
  interventionRender() {
    return (
      <Intervention
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  evaluationRender() {
    return (
      <Evaluation
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  nodeRender() {
    return (this.props.node) &&
      <div>
        {this.jumbotronRender()}
        {this.assessmentRender()}
        <hr/>
        {this.diagnosisRender()}
        <hr/>
        {this.interventionRender()}
        <hr/>
        {this.evaluationRender()}
      </div>;
  }
  render() {
    return (
      <div
        className = 'Node col-md-8 offset-md-2'
      >
        {this.nodeRender()}
      </div>
    );
  }
}

export default createContainer(Node, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          ${Jumbotron.getFragment('node')},
          ${Assessment.getFragment('node')},
          ${Diagnosis.getFragment('node')},
          ${Intervention.getFragment('node')}
          ${Evaluation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Jumbotron.getFragment('viewer')},
          ${Assessment.getFragment('viewer')},
          ${Diagnosis.getFragment('viewer')},
          ${Intervention.getFragment('viewer')}
          ${Evaluation.getFragment('viewer')}
        }
      `;
    }
  }
});
