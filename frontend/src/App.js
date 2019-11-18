import React, { Component } from 'react';
import './App.css';

class Bets extends React.Component {
    constructor(props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this)
        this.state = { 
            betValue: this.props.betValue
        }
    }
  
    handleValueChange(event){
        this.setState({
            betValue: event.target.value,
            [event.target.name]: event.target.value
        });
    }

    render() {
        let keyValue = 0;
        
        let betOptions = Object.keys(this.props.apiResponse).map((key) =>{
            keyValue++;
            let parentBet = this.props.apiResponse[key];
            let individualBets = this.props.apiResponse[key].odds;

            // sort the possible bets into descending order for best possible bet as first item
            function sortByNumber(a, b) {
                return a.oddsDecimal < b.oddsDecimal ? 1 : b.oddsDecimal < a.oddsDecimal ? -1 : 0;
            }
            individualBets.sort(sortByNumber);
            let bestOdd = individualBets[0];

            return <li key={keyValue} className="individual-bet">
                    <h1>{parentBet.name}</h1>
                    <h2> Best odds {bestOdd.oddsFractional}</h2>
                    <form>
                        £<input type="number" name={parentBet.map} onChange={this.handleValueChange}></input>
                        <button type="submit" value={this.state.betValue} odds={bestOdd.oddsDecimal} betname={parentBet.name} onClick={this.props.openBetSlip}>
                            <span>Submit</span>
                        </button>
                    </form>
                </li>;
        });

        return (
            <div className="bet-option-wrap">
                <ul>
                {betOptions}
                </ul>
            </div>
        )
    }
}

class BetOptions extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            oddOptions: [
                'decimalOddsMoreThanTwo',
                'decimalOddsLessThanTwo'
            ]
        }
    }
    render() {
        let options = this.state.oddOptions.map((item, index) => {
            return (
                <option className="odd-option" key={index}> {item} </option>
            );
        });
        return (
            <div className="odd-option-wrap">
                <h1>Betslip</h1>
                <select onChange={this.props.handleChange}>
                    <option className="odd-option">Select some odds</option>
                    {options}
                </select>
            </div>
        );
    }
}

class Betslip extends Component {
    render(){
        let userValue = this.props.props.betValue,
            betName = this.props.props.betName,
            oddValue = this.props.props.oddValue,
            betTotal = this.props.props.userStake.toFixed(2),
            betEle = <li>{betName}: £{userValue} at {oddValue}. Total stake £{betTotal}</li>

        return <div className="bet-receipt"> 
                <h1> Receipt </h1>
                <h2> Your bets: </h2>
                <ul>
                    {betEle}
                </ul>
            </div>
    }
}


class App extends Component {
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.openBetSlip = this.openBetSlip.bind(this);
        this.state = { 
            apiResponse: {},
            betValue: 0,
            showingBetSlip: false
        };
    }

    handleChange(event){
        this.getData(event.target.value);
    }

    getData(value) {
        let requestURL = 'http://localhost:4000/'+value;
        let myRequest = new Request(requestURL);

        fetch(myRequest)
        .then(response => response.json())
        .then(data => {
            this.setState({ 
                apiResponse: data,
            })
        })
    }

    openBetSlip(event){
        event.preventDefault();

        let userValue = event.target.value,
            oddValue = event.target.getAttribute('odds'),
            betName = event.target.getAttribute('betname'),
            userStake = userValue * oddValue,
            betMap = event.target.getAttribute('name');
        
        this.setState({
            betValue: event.target.value,
            [betMap]: event.target.value,
            showingBetSlip: true,
            userStake,
            betName,
            oddValue
        })
    }

    render() {
        return (
            <div className="App">
                < BetOptions handleChange={this.handleChange.bind(this)} />
                < Bets apiResponse={this.state.apiResponse} openBetSlip={this.openBetSlip} betValue={this.state.betValue}/> 
                {this.state.showingBetSlip ?  <Betslip props={this.state} /> : ''}
            </div>
        );
    }
}

export default App;
