// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ghobet {
    struct Bet {
        address bettor;
        uint amount;
        bool outcome; // true for "agree" false for "against"
    }

    struct Prediction {
        string text;
        uint betDate;
        uint endDate;
        uint totalFor;
        uint totalAgainst;
        Bet[] bets;
    }

    IERC20 public ghoToken;
    Prediction[] public predictions;

    event PredictionMade(uint indexed predictionId, string text, uint betDate, uint endDate);
    event BetPlaced(uint indexed predictionId, address indexed bettor, uint amount, bool outcome);

    constructor(address _ghoToken) {
        ghoToken = IERC20(_ghoToken);
    }

    function makePrediction(string calldata text, uint endDate) external {
        uint predictionId = predictions.length;

        predictions.push(Prediction({
            text: text,
            betDate: block.timestamp,
            endDate: endDate,
            totalFor: 0,
            totalAgainst: 0,
            bets: new Bet[](0)
        }));

        emit PredictionMade(predictionId, text, block.timestamp, endDate);
    }

    function getPrediction(uint predictionId) external view returns (Prediction memory) {
        require(predictionId < predictions.length, "Prediction does not exist");
        return predictions[predictionId];
    }

    function betOnPrediction(uint predictionId, uint amount, bool outcome) external {
        require(predictionId < predictions.length, "Prediction does not exist");
        require(block.timestamp < predictions[predictionId].endDate, "Prediction has ended");

        Bet memory newBet = Bet({
            bettor: msg.sender,
            amount: amount,
            outcome: outcome
        });

        predictions[predictionId].bets.push(newBet);

        if (outcome) {
            predictions[predictionId].totalFor += amount;
        } else {
            predictions[predictionId].totalAgainst += amount;
        }

        ghoToken.transferFrom(msg.sender, address(this), amount);

        emit BetPlaced(predictionId, msg.sender, amount, outcome);
    }
}