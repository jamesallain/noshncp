'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import autosize from 'autosize';

import BootstrapDatepicker from 'components/BootstrapDatepicker';
import DiagnosisCreateMutation from 'mutations/DiagnosisCreate';

class Create extends Component {
  state = {
    company: '',
    title: '',
    country: '',
    region: '',
    since: '',
    until: '',
    description: ''
  };
  componentDidMount() {
    autosize($(this.refs.descriptionTextarea));
  }
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onCountrySelectHandle = (country) => {
    this.setState({country});
  };
  onRegionSelectHandle = (region) => {
    this.setState({region});
  };
  onSinceChangeHandle = (since) => {
    this.setState({since});
  };
  onUntilChangeHandle = (until) => {
    this.setState({until});
  };
  errShow = (err) => {
    $(this.refs.diagnosisCreate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if (/(country|region)/.test(err.source)) {
          $([this.refs.countryFormGroup, this.refs.regionFormGroup])
            .addClass('has-danger')
            .find('.btn')
            .addClass('btn-danger')
            .end()
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        else if (/(since|until)/.test(err.source)) {
          $(this.refs.sinceFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);
          $(this.refs.untilFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);
        }

        else if ($(el).find('.form-control').data('key') === err.source) {
          $(el).addClass('has-danger');
          $(el).find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        return memo;
      }, []);
  };
  diagnosisCreate = () => {
    this.props.relay.commitUpdate(
      new DiagnosisCreateMutation({
        company: this.state.company.trim(),
        title: this.state.title.trim(),
        country: this.state.country.trim(),
        region: this.state.region.trim(),
        since: this.state.since.trim(),
        until: this.state.until.trim(),
        description: this.state.description.trim(),
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.props.onCreateSucces();
        }
      }
    );
  };
  errClear = () => {
    $(this.refs.diagnosisCreate)
      .find('.form-group')
      .removeClass('has-danger');
    $(this.refs.diagnosisCreate)
      .find('.form-control-feedback')
      .text('');
    $(this.refs.diagnosisCreate)
      .find('.btn')
      .removeClass('btn-danger');
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.diagnosisCreate();
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onCreateCancel();
  };
  formRender() {
    return (
      <form
        ref = 'diagnosisCreate'
        className = 'col-md-8 offset-md-2'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'companyFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'companyInput'
            className = 'form-control'
            placeholder = 'company'
            value = {this.state.company}
            data-key = 'company'
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
            placeholder = 'title'
            value = {this.state.title}
            data-key = 'title'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div className = 'row'>
          <div
            ref = 'countryFormGroup'
            className = 'form-group col-6'
          >
            <CountryDropdown
              classes = 'btn btn-secondary dropdown-toggle col-12'
              className = 'form-control'
              value = {this.state.country}
              onChange = {this.onCountrySelectHandle}
            />
            <span className = 'form-control-feedback'></span>
          </div>
          <div
            ref = 'regionFormGroup'
            className = 'form-group col-6'
          >
            <RegionDropdown
              classes = 'btn btn-secondary dropdown-toggle col-12'
              className = 'form-control'
              country = {this.state.country}
              value = {this.state.region}
              onChange = {this.onRegionSelectHandle}
            />
            <span className = 'form-control-feedback'></span>
          </div>
        </div>
        <div className = 'row'>
            <div
              ref = 'sinceFormGroup'
              className = 'form-group col-6'
            >
              <BootstrapDatepicker
                className = 'form-control'
                placeholder = 'since'
                minViewMode = 'months'
                format = 'mm/yyyy'
                formatter = 'MM[/]YYYY'
                eventName = 'changeMonth'
                value = {this.state.since}
                data-key = 'since'
                onSuccess = {this.onSinceChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
            <div
              ref = 'untilFormGroup'
              className = 'form-group col-6'
            >
              <BootstrapDatepicker
                className = 'form-control'
                placeholder = 'until'
                minViewMode = 'months'
                format = 'mm/yyyy'
                formatter = 'MM[/]YYYY'
                eventName = 'changeMonth'
                value = {this.state.until}
                data-key = 'until'
                startDate = {this.state.since}
                onSuccess = {this.onUntilChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
        </div>
        <div
          ref = 'descriptionFormGroup'
          className = 'form-group'
        >
          <textarea
            ref = 'descriptionTextarea'
            className = 'form-control'
            placeholder = 'description'
            value = {this.state.description}
            data-key = 'description'
            onChange = {this.onChangeHandle}
          ></textarea>
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          {
            (!this.props.createRequired &&
             this.props.createTriggered) &&
              <button
                className = 'btn btn-outline-warning'
                value = 'Cancel'
                onClick = {this.onCancelHandle}
              >
                Cancel
              </button>
          }
          <input
            type = 'submit'
            className = 'btn btn-outline-success'
            value = 'Create'
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
      <div className = 'Create'>
        {this.cardRender()}
      </div>
    );
  }
}

export default createContainer(Create, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Patient {
          ${DiagnosisCreateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${DiagnosisCreateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
