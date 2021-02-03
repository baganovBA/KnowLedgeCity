import './UserList.css';
import React from 'react'

class UserList extends React.Component {

    state = {}

    componentDidMount () {
        this.getUsers()
    }

    getUsers = () => {
        const login = localStorage.getItem('login')
        const token = localStorage.getItem('token')

        fetch('http://localhost:5000/users', {
            method: "GET",
            headers: { 'x-token': token }
        }).then(res => res.json()).then(data => {
            this.setState({ data: data })
        })
    }

    render () {
        return (

            <div className='main'>
                <h1>User List</h1>
                <div className='container'>
                <ul>
                    {
                        this.state.data ? this.state.data.map(el => <li className>{el.name}</li>) : (<li>loading...</li>)
                    }
                </ul>
            </div>
            </div>
        )
    }
}

export default UserList
