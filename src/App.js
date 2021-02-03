import './App.css';
import { Route, Redirect } from 'react-router-dom'
import Login from './Login';
import UserList from './UserList';
import PrivateRoute from './component/PrivateRoute'

function App () {
    return (
        <div>
            <Route name="app" path="/" exact>
                <Redirect from="/" to="/userlist" />
            </Route>
            <Route path='/login' component={Login} />
            <PrivateRoute path='/userlist' component={UserList} />
        </div>
    );
}

export default App;
