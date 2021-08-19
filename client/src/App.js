import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from "react-lottie";
import './App.css';
import ChairIcon from "./asset/ChairIcon"
import * as loadAnimation from "./Animation/simpleLoad.json"

// Component to load and refresh
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadAnimation.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_seats:null,
      number_of_seats_remained : 0,
      per_row : null,
      no_of_seats:'',
      seats_occupied:[],
      isLoading:true
    };
  }

  // assign the field value
  setUser = (user) => {
    const value = user.target.value;
    const field = user.target.name;
    this.setState({ [field]: value });
  };

  // Fetch the details when component inital rendered
  componentDidMount() {
    axios.get('http://localhost:8090/')
      .then(res => this.setState({seats_occupied:res.data.seats, number_of_seats_remained:res.data.remaining_seats, total_seats:res.data.total_seats, per_row:res.data.seats_per_row, isLoading:false}))
      .catch(err => {
        this.setState({isLoading:false})
        alert("Tickets were not booked\nPlease try again")
      })
  }

  // Book the tickets, and assign the respone to the field value
  bookTicket=(e)=> {
    this.setState({isLoading:true})
    e.preventDefault();
    if(this.state.no_of_seats<=this.state.per_row & this.state.no_of_seats<this.state.number_of_seats_remained){
      axios.get("http://localhost:8090/book", {params: {seat: this.state.no_of_seats}})
      .then(res =>{
        this.setState({username:'',no_of_seats:'',seats_occupied:res.data[0],number_of_seats_remained:res.data[1]})
        this.setState({isLoading:false})
      })
      .catch(err =>{
        this.setState({username:'',no_of_seats:'',isLoading:false})
        alert("Tickets were not booked\nPlease try again")
      })
    }else{
      this.setState({isLoading:false})
      alert(`One person can reserve up to ${this.state.per_row}at a time\nRemaning tickets are ${this.state.number_of_seats_remained}`)
    }
  }

  // Main page parent class
  render() {
    return (
      <>
      {this.state.isLoading ? (<Lottie options={defaultOptions} height={420} width={320}/>) :
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="seats"><b>No. of seats</b></label>
              <input type="text" placeholder="No. of seats" name="no_of_seats" value={this.state.no_of_seats} onChange={this.setUser} required/>
              <button onClick={this.bookTicket}>submit</button>
            </div>
            <div className="col-md-9">
              <Seats seats_occupied={this.state.seats_occupied} per_row_seats={this.state.per_row} total_seats={this.state.total_seats} remaining_seats={this.state.number_of_seats_remained}/>
            </div>
        </div>
    </div>}
    </>
    );
  }
}

// Seats child class 
class Seats extends React.Component {

  render() {
    // Assign the seats based on the categorization of seats values
    let seats = []
    let j=0
    for(var i=0; i<this.props.seats_occupied.length; i++){
      let seat = []
      for(var k=0;k<this.props.seats_occupied[i][0];k++,j++){
        this.props.seats_occupied[i][0]-k > this.props.seats_occupied[i][1] ? seat.push(<div key={j} className="col-1"><ChairIcon fill="red"/></div>) : seat.push(<div key={j} className="col-1"><ChairIcon fill="green"/></div>)
      }
      seats.push(<div key={i} className="row">{seat}</div>)
    }
    
    // render the response on the frontend
    return (
      <React.Fragment>
        <div className="containerIntro">
          <h5 style={{float:"left",margin:'2%'}}>Available Seats : {this.props.remaining_seats}</h5>
          <h5 style={{float:"right",margin:'2%'}}>Booked Seats : {this.props.total_seats-this.props.remaining_seats}</h5>
        </div>
        <div className="jumbotron">
            <div className="container">
              {seats}
            </div>
        </div>
        </React.Fragment>
    );
}
}

export default App;
