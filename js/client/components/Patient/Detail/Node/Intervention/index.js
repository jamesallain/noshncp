'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Item from './Item';
import Controls from './Controls';
import Create from './Create';

class Education extends Component {
  state = {
    createRequired: createRequiredGet(this.props),
    createTriggered: false,
    interventionActiveId: null
  };
  componentWillReceiveProps(nextProps) {
    this.setState({createRequired: createRequiredGet(nextProps)});
  }
  onUpdateTriggerHandle = (interventionId) => {
    this.setState({interventionActiveId: interventionId});
  };
  itemsRender() {
    return this.props.node.interventions.reduce((memo, item, index) => {
      return [
        ...memo,
        <Item
          key = {index}
          item = {item}
          node = {this.props.node}
          viewer = {this.props.viewer}
          lastChild = {
            (index === this.props.node.interventions.length - 1) ?
              true :
              false
          }
          onUpdateTrigger = {this.onUpdateTriggerHandle}
          updateTriggered = {
            (this.state.interventionActiveId &&
             this.state.interventionActiveId.toString() === item.id.toString()) ?
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
      <div className = 'Education'>
        <h6>Education</h6>

        {
          (!!this.props.node.interventions.length) &&
            <hr/>
        }

        {this.createRender()}
        {this.itemsRender()}
        {this.controlsRender()}
      </div>
    );
  }
}

export default createContainer(Education, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          interventions {
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
  return (props.node.interventions.length) ?
    false :
    true;
};
