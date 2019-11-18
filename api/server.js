const express = require('express');
const app = express();
const cors = require('cors');
const betData = require('./data/data.json');
const filterOptions = {
    greaterThanTwo: 'decimalOddsMoreThanTwo',
    lessThanTwo: 'decimalOddsLessThanTwo'
}

app.use(cors());

function sortData(filter){
    let matchedData = {},
        count = 0;
    betData.bets.forEach(function(item, index){
        let individualBet = item;

        for (let bet of individualBet.odds) {
            if (filter === filterOptions.greaterThanTwo){
                // if any of the possible bets have odds > 2, save the whole object
                if (bet.oddsDecimal > 2) {
                    matchedData[count] = individualBet;
                    count++
                    break;
                }
            }
            else if (filter === filterOptions.lessThanTwo){
                if (bet.oddsDecimal < 2) {
                    matchedData[count] = individualBet;
                    count++
                    break;
                }
            }
        }
    })
    return matchedData
}

sortData(filterOptions.greaterThanTwo);

app.get('/'+filterOptions.greaterThanTwo, (req, res) => {
    let filteredData = sortData(filterOptions.greaterThanTwo);
    res.json( filteredData );
});

app.get('/'+filterOptions.lessThanTwo, (req, res) => {
    let filteredData = sortData(filterOptions.lessThanTwo);
    res.json( filteredData );
});

app.listen(4000, () => {
    console.log('Example app listening on port 4000!');
});