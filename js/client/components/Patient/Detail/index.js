'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Node from './Node';

class Detail extends Component {
  state = {
    node: null,
    isCreator: false
  };
  componentWillMount() {
    console.log("componentWillMount:",this.props)
    this.variablesSet(this.props);
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps:",nextProps)
    if (nextProps.params.id !== this.props.params.id) {
      this.variablesSet(nextProps);
    }

    this.stateIsCreatorSet(nextProps);
  }
  stateNodeSet = (props) => {
    console.log("stateNodeSet:",this.props)
    const edges = props.viewer.patient.edges;
    const node = (edges.length) && edges[0].node;

    return new Promise((resolve) => {
      this.setState({node}, () => {
        return resolve(null);
      });
    });
  };
  stateIsCreatorSet = (props) => {
    if (this.state.node &&
        props.viewer.user.patientId === this.state.node.id) {
      this.setState({isCreator: true});
    }
    else {
      this.setState({isCreator: false});
    }
  };
  variablesSet = (props) => {
    console.log("variablesSet:",this.props)

    return new Promise((resolve) => {
      this.props.relay.setVariables(
        {id: props.params.id},
        (readyState) => {
          if (readyState.mounted &&
            readyState.done) {
            return resolve();
          }
        }
      );
    })
      .then(() => {
        return this.stateNodeSet(this.props);
      })

      .then(() => {
        return this.stateIsCreatorSet(this.props);
      });
  };
  nodeRender = () => {
    return (
      <Node
        node = {this.state.node}
        isCreator = {this.state.isCreator}
        viewer = {this.props.viewer}
      />
    );
  };
  render() {
    return (
      <div className = 'Detail'>
        {this.nodeRender()}
      </div>
    );
  }
}

export default createContainer(Detail, {
  initialVariables: {
    first: 1,
    id: null
  },
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          user {
            patientId
          },
          patient(first: $first, id: $id) {
            edges {
              node {
                id,
                ${Node.getFragment('node')}
              }
            }
          },
          ${Node.getFragment('viewer')}
        }
      `;
    }
  }
});
