import React from 'react';
import './App.css';
import { Button, TextField, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import config from './config.js';

export default class App extends React.Component {
  constructor(){
    super();

    this.state = {
      minute: "",
      second: "",
      symbol: "",
      data: []
    };
  }

  getCurrentTime(){
    const date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds().toString().padStart(2,"0");

    return timeStr;
  }

  getStockData(symbol){
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${config.apiKey}`)
    .then(response => response.json())
    .then(row => {
      row.time = this.getCurrentTime(); //add time to object
      this.setState({ data: [...this.state.data, row]})
    })
    .catch(err => console.log("Error: " + err));
  }
  
  handleSubmit(e){
    const { minute, second, symbol } = this.state;
    const totalTime = ((minute*60) + second) * 1000;  //convert mins + secs to millisecs

    this.getStockData(symbol);  //Initial stock data
    window.setInterval(() => this.getStockData(symbol), totalTime); //Recurring stock data
  }

  handleChange(e){
    this.setState({ [e.target.id]: e.target.value }, () => console.log(this.state));
  }

  render(){
    const { data } = this.state;
    const headerTitles = [
      "Open Price ",
      "High Price",
      "Low Price",
      "Current Price",
      "Previous Close Price",
      "Time"
    ];


    return (
      <div className="App">
        <header>
          <h1>Stock Tracker</h1>
        </header>
        <main>
          <div className="Input-container">
            <form>
              <TextField type="number" id="minute" label="Min" value={this.state.minute} onChange={(e) => this.handleChange(e)} />
              <TextField type="number" placeholder="0" id="second" label="Sec" value={this.state.second} onChange={(e) => this.handleChange(e)}/>
              <TextField id="symbol" label="Symbol" value={this.state.symbol} onChange={(e) => this.handleChange(e)}/>
              <Button label="Submit" onClick={(e) => this.handleSubmit(e)}>Submit</Button>
            </form>
          </div>
          <TableContainer className="Data-table">
            <Table>
              <TableHead>
                <TableRow>
                  {
                    headerTitles.map((title, i) => (<TableCell key={i}>{title}</TableCell>))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((element,i) => {
                  const { o, h, l, c, pc, time } = element;

                  return(
                    <TableRow key={i}>
                      <TableCell>{o}</TableCell>
                      <TableCell>{h}</TableCell>
                      <TableCell>{l}</TableCell>
                      <TableCell>{c}</TableCell>
                      <TableCell>{pc}</TableCell>
                      <TableCell>{ time }</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
    );
  }
}