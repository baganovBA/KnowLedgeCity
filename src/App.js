import './App.css';
import {Route, Redirect} from 'react-router-dom'
import Login from './Login';
import UserList from './UserList';

function App() {
  return (
    <div>
    <Route name="app" path="/" exact>
      <Redirect from="/" to="/login" />
    </Route>
      <Route path='/login' component={Login} />
      <Route path='/userlist' component={UserList} />
      </div>
  );
}

export default App;
