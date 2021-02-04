import './UserList.css';
import React from 'react'
import logout from "./logout.svg"

class UserList extends React.Component {

    state = {currentPage:1}

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
            const pagesLengs = Math.ceil(data.length/5)
            let pages=[]
            for(let i =1; i<=pagesLengs; i++){
                pages.push(i)
            }
            this.setState({ data: data, pages:pages })
            
        })
    }

    logOut =()=>{
        const token = localStorage.getItem('token')
        fetch('http://localhost:5000/logout', {
            method: "DELETE",
            headers: { 'x-token': token }
        }).then(res => res.json()).then(data => {
            localStorage.clear()
            document.location.reload()})
        }  

    selectPage= (e) =>{
        this.setState({currentPage: parseInt(e.target.innerText) })
        
    }

    nextPage = () => {
       
        if(this.state.currentPage < this.state.pages.length){
            this.setState({currentPage: this.state.currentPage + 1})
        }
      }
    
      previousPage = () => {
        if (this.state.currentPage !== 1 && this.state.currentPage !== "1")
          this.setState({currentPage: this.state.currentPage - 1})
      }

    render () {
        return (

            <div className='main'>
                <h1>User List</h1>
                <div className='line'></div>
                <div className='container'>
                <ul className='container_list'>
                    {
                        this.state.data ?
                         this.state.data.slice((this.state.currentPage==1 ? 0 : ((this.state.currentPage-1)*5)),
                             (this.state.currentPage==1 ? 5 : ((this.state.currentPage-1)*5+5))).map((el,index) => {
                            let color;
                            if(index % 2){
                                color = 'gray'
                            }else{
                                color = 'white'
                            }
                            return <li className={`container_item ${color}`}><p>{el.id} <br/> {el.name}</p> <p>{el.group}</p></li>}) : (<li>loading...</li>)
                    }
                </ul>
                <div className='container_pages'>
                   {this.state.currentPage !== 1 && this.state.currentPage !== "1" && <button onClick={this.previousPage} className='next_page_btn'> Prev Page </button>}
                    {this.state.pages && this.state.pages.map(el=> <div className='container_pages_item' onClick={this.selectPage}>{el}</div>)}
                    <button onClick={this.nextPage} className='next_page_btn'> Next Page </button>
                </div>
            </div>
                <div className='footer'> <img onClick={this.logOut} className='footer_img' src = {logout} alt='logout' /> <span>Log Out</span>  </div>
            </div>
        )
    }
}

export default UserList
