'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Item from './Item';
import Controls from './Controls';
import Create from './Create';

class Diagnosis extends Component {
  state = {
    createRequired: createRequiredGet(this.props),
    createTriggered: false,
    diagnosisActiveId: null
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      createRequired: createRequiredGet(nextProps)
    });
  }
  onUpdateTriggerHandle = (diagnosisId) => {
    this.setState({
      diagnosisActiveId: diagnosisId
    });
  };
  itemsRender() {
    return this.props.node.diagnosis.reduce((memo, item, index) => {
      return [
        ...memo,
        <Item
          key = {index}
          item = {item}
          node = {this.props.node}
          viewer = {this.props.viewer}
          lastChild = {
            (index === this.props.node.diagnosis.length - 1) ?
              true :
              false
          }
          onUpdateTrigger = {this.onUpdateTriggerHandle}
          updateTriggered = {
            (this.state.diagnosisActiveId &&
             this.state.diagnosisActiveId.toString() === item.id.toString()) ?
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
  onCreateSuccesHandle = () => {
    this.setState({
      createRequired: false,
      createTriggered: false
    });
  };
  onCreateCancelHandle = () => {
    this.setState({createTriggered: false});
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
      <div className = 'Diagnosis'>
        <h6>Diagnosis</h6>

        {
          (!!this.props.node.diagnosis.length) &&
            <hr/>
        }

        {this.createRender()}
        {this.itemsRender()}
        {this.controlsRender()}
      </div>
    );
  }
}

export default createContainer(Diagnosis, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          diagnosis {
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
  return (props.node.diagnosis.length) ?
    false :
    true;
};
