var Reflux = require('reflux');

var AppActions = Reflux.createActions([
    'clickOnReward',
    'onPopulateQuestions',
    'answerQuestion',
    'answerDismissedQuestion',
    'dismissQuestion',
    'updateRewards',
    'openReward',
    'closeReward',
    'claimReward'
]);

module.exports = AppActions;
