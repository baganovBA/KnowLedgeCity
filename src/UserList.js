import './UserList.css';
import React from 'react'

class UserList extends React.Component{

    state={}

    componentDidMount(){
        this.getUsers()
    }

    getUsers =()=>{
        const login = localStorage.getItem('login')
        const token = localStorage.getItem('token')

        fetch('http://localhost:5000/users',{
            method:"GET",
            headers: {'login':`${login}`, 'token':`${token}`}
        }).then(res=> res.json()).then(data=> {this.setState({data:data}, ()=>{console.log(this.state)})})
    }

    render(){
        return(

        <div className='container'>
            <h1>User List</h1>
            <ul>
                {/* {this.state.data &&  this.state.data.map((el)=>{
                    return <li>{el.name}</li>
                })} */}
                <li>User</li>

            </ul>
        </div>
        )
    }
}

export default UserList