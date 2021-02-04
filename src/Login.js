import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import logo from './logo.svg';
import user from './user.svg';
import password from './password.svg';
import './Login.css';
import UserList from './UserList';
import PrivateRoute from './component/PrivateRoute'


class Login extends React.Component {

    state = {}

    onChangeHandaler = (event) => {
        var inputName = event.target.name;
        var inputValue = event.target.value;
        this.setState({ [inputName]: inputValue })
    }

    sendAuth = (event) => {
        event.preventDefault()
        fetch('http://localhost:5000/auth', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(this.state)
        }).then(async res => {
            if (res.status !== 200) {
                throw await res.json()
            }
            return res.json()
        })
            .then((data) => {
                console.log('data', data)
                localStorage.setItem('login', data.login)
                localStorage.setItem('token', data.token)
                this.setState({ isLoggined: true })
                document.location.reload();
            })
            .catch(error => {console.log('error', error)
            this.setState({error:true})
        })
    }
   
    render () {
        return (
            <div className="app">
                <img src={logo} alt="Logo KnowledgeCity" />
                <p className="app_welcome">Welcome to the Learning Management System</p>
                <p className="app_login">Please log in to continue</p>
                <form className='form'>
                    <div className='form_string'>
                        <img className='form_string_img' src={user} alt='logo_user' />
                        <input onChange={this.onChangeHandaler} className='form_input' name='login' type='text' placeholder='Username' />
                    </div>
                    <div className='form_string'>
                        <img className='form_string_img' src={password} alt='logo_password' />
                        <input onChange={this.onChangeHandaler} className='form_input' name='password' type='password' placeholder='Password' />
                    </div>
                    {this.state.error && <p className='error'>Неверные данные</p>}
                    <div className='form_input_checkbox'><input type='checkbox' /><span>Remember me</span></div>
                    <button onClick={this.sendAuth} type='submit' className='form_button'>Log In</button>
                </form>

                {this.state.isLoggined && 
                <Redirect to ='/userlist' />
                }

            </div>)
    }
}

export default Login
