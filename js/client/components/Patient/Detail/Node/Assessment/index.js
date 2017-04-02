'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Item from './Item';
import Controls from './Controls';
import Create from './Create';

class Assessment extends Component {
  state = {
    createRequired: createRequiredGet(this.props),
    createTriggered: false,
    assessmentActiveId: null
  };
  componentWillReceiveProps(nextProps) {
    this.setState({createRequired: createRequiredGet(nextProps)});
  }
  onUpdateTriggerHandle = (assessmentId) => {
    this.setState({assessmentActiveId: assessmentId});
  };
  itemsRender() {
    return this.props.node.assessments.reduce((memo, item, index) => {
      return [
        ...memo,
        <Item
          key = {index}
          item = {item}
          node = {this.props.node}
          viewer = {this.props.viewer}
          lastChild = {
            (index === this.props.node.assessments.length - 1) ?
              true :
              false
          }
          onUpdateTrigger = {this.onUpdateTriggerHandle}
          updateTriggered = {
            (this.state.assessmentActiveId &&
             this.state.assessmentActiveId.toString() === item.id.toString()) ?
              true :
              false
          }
        />
      ];
    }, []);
  }
  onCreateTriggerHandle = () => {
    this.setState({createTriggered: true});
  };
  onCreateCancelHandle = () => {
    this.setState({createTriggered: false});
  };
  onCreateSuccesHandle = () => {
    this.setState({
      createTriggered: false,
      createRequired: false
    });
  };
  controlsRender() {
    return (!this.state.createRequired &&
      !this.state.createTriggered) &&
      <Controls
        onCreateTrigger = {this.onCreateTriggerHandle}
      />;
  }
  createRender() {
    return ((this.state.createRequired ||
      this.state.createTriggered)) &&
      <Create
        node = {this.props.node}
        viewer = {this.props.viewer}
        createRequired = {this.state.createRequired}
        createTriggered = {this.state.createTriggered}
        onCreateSucces = {this.onCreateSuccesHandle}
        onCreateCancel = {this.onCreateCancelHandle}
      />;
  }
  render() {
    return (
      <div className = 'Assessment'>
        <h6>Assessment</h6>

        {
          (!!this.props.node.assessments.length) &&
            <hr/>
        }

        {this.createRender()}
        {this.itemsRender()}
        {this.controlsRender()}
      </div>
    );
  }
}

export default createContainer(Assessment, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          assessments {
            id,
            ${Item.getFragment('item')}
          },
          ${Create.getFragment('node')},
          ${Item.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Create.getFragment('viewer')},
          ${Item.getFragment('viewer')}
        }
      `;
    }
  }
});

const createRequiredGet = (props) => {
  return (props.node.assessments.length) ?
    false :
    true;
};
