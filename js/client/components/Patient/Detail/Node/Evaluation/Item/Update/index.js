'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import BootstrapDatepicker from 'components/BootstrapDatepicker';
import PatientEvaluationUpdateMutation from 'mutations/PatientEvaluationUpdate';

class Update extends Component {
  state = {
    date: this.props.item.date,
    degree: this.props.item.degree,
    title: this.props.item.title
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onDateChangeHandle = (date) => {
    this.setState({date});
  };
  errShow = (err) => {
    $(this.refs.patientEvaluationUpdate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if (/date/.test(err.source)) {
          $(this.refs.dateFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        else if ($(el).find('.form-control').data('key') === err.source) {
          $(el)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        return memo;

      }, []);
  };
  errClear = () => {
    $(this.refs.patientEvaluationUpdate)
      .find('.form-group')
      .removeClass('has-danger')
      .find('.form-control-feedback')
      .text('');
  };
  patientEvaluationUpdate = () => {
    this.props.relay.commitUpdate(
      new PatientEvaluationUpdateMutation({
        date: this.state.date.trim(),
        degree: this.state.degree.trim(),
        title: this.state.title.trim(),
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.props.onUpdateSuccess();
        }
      }
    );
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.patientEvaluationUpdate();
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onUpdateCancel();
  };
  formRender() {
    return (
      <form
        ref = 'patientEvaluationUpdate'
        className = 'col-6 col-md-4'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'dateFormGroup'
          className = 'form-group'
        >
          <BootstrapDatepicker
            className = 'form-control'
            placeholder = 'date'
            minViewMode = 'years'
            format = 'yyyy'
            formatter = 'YYYY'
            eventName = 'changeYear'
            value = {this.state.date}
            data-key = 'date'
            onSuccess = {this.onDateChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div
          ref = 'degreeFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'degreeInput'
            className = 'form-control'
            placeholder = 'degree'
            value = {this.state.degree}
            data-key = 'degree'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div
          ref = 'titleFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'titleInput'
            className = 'form-control'
            placeholder = 'institution'
            value = {this.state.title}
            data-key = 'title'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          <button
            className = 'btn btn-outline-warning'
            onClick = {this.onCancelHandle}
          >
            Cancel
          </button>
          <input
            type = 'submit'
            className = 'btn btn-outline-success'
            value = 'Update'
          />
        </div>
      </form>
    );
  }
  cardBlockRender() {
    return (
      <div className = 'card-block'>
        {this.formRender()}
      </div>
    );
  }
  cardRender() {
    return (
      <div className = 'card'>
        {this.cardBlockRender()}
      </div>
    );
  }
  render() {
    return (
      <div className = 'Update'>
        {this.cardRender()}
      </div>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Evaluation {
          date,
          degree,
          title,
          ${PatientEvaluationUpdateMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Patient {
          ${PatientEvaluationUpdateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${PatientEvaluationUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
