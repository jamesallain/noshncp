'use strict';

import React from 'react';
import Relay, {Store} from 'react-relay';
import useRelay from 'react-router-relay';
import {
  browserHistory,
  applyRouterMiddleware,
  Router,
  Route,
  IndexRedirect
} from 'react-router';
import {render} from 'react-dom';

import 'vendor.bundle.scss';
import 'vendor.bundle.less';
import 'components/BootstrapDatepicker/dist/js/bootstrap-datepicker.js';
import 'components/BootstrapDatepicker/dist/css/bootstrap-datepicker.css';

import Viewer from 'components';
import Profile from 'components/Profile';
import ProfileEdges from 'components/Profile/Edges';
import ProfileDetail from 'components/Profile/Detail';

import Patient from 'components/Patient';
import PatientEdges from 'components/Patient/Edges';
import PatientDetail from 'components/Patient/Detail';
import Auth from 'components/Auth';

const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port ?
  `:${window.location.port}` :
  '';
const host = `${protocol}//${hostname}${port}/graphql`;

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(
    host,
    {credentials: 'same-origin'}
  )
);

const RootQueries = {
  viewer() {   
    return Relay.QL`
      query {
        viewer
      }
    `;
  }
};

console.log({Viewer})


render(
  <Router
    history = {browserHistory}
    render = {applyRouterMiddleware(useRelay)}
    environment = {Store}
    onUpdate = {() => window.scrollTo(0, 0)}
  >
    <Route
      path = '/'
      component = {Viewer}
      queries = {RootQueries}
    >
      <Route
        path = 'Auth'
        component = {Auth}
      />
      <IndexRedirect to = 'Patient'/>
      <Route
        path = 'Patient'
        component = {Patient}
      >
        <IndexRedirect to = 'Edges'/>
        <Route
          path = 'Edges'
          component = {PatientEdges}
        />
        <Route
          path = ':id'
          component = {PatientDetail}
        />
      </Route>      

      <Route
        path = 'Profile'
        component = {Profile}
      >
        <IndexRedirect to = 'Edges'/>
        <Route
          path = 'Edges'
          component = {ProfileEdges}
        />
        <Route
          path = ':id'
          component = {ProfileDetail}
        />
      </Route>   

    </Route>
  </Router>,
  document.getElementById('viewer')
);


        /*<IndexRedirect to = 'Patient'/>
        <Route
          path = 'Patient'
          component = {Patient}
        >
        <IndexRedirect to = 'Edges'/>
        <Route
          path = 'Edges'
          component = {PatientEdges}
        />
        <Route
          path = ':id'
          component = {PatientDetail}
        />
        </Route>*/