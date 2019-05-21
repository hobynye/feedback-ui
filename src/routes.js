import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Home from './components/Home';
import Results from './components/Results'
import ManageUsers from "./components/ManageUsers";
import Login from './components/Login';
import EditUser from './components/EditUser';

export default (
    <HashRouter>
     <div>
      <Route exact path='/' component={Home} />
      <Route path='/home' component={Home} />
      <Route path='/results' component={Results} />
      <Route exact path='/users' component={ManageUsers} />
      <Route path='/users/edit' component={EditUser}/>
      <Route path='/login' component={Login}/>
     </div>
    </HashRouter>
);
