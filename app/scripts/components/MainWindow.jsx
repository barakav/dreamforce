var React = require('react');
var AppContainer = require('./AppContainer');
var Router = require('react-router');
var Reflux = require('reflux');
var AppStore = require('../stores/AppStore');

var MainWindow = React.createClass({
    mixins: [Router.Navigation,
             Router.State,
             Reflux.connect(AppStore, 'appData')],

    render: function() {
        if (!this.state.appData.user.isSignin) {
            window.location = "/#/signin";
        }

        return (
            <div>
                <AppContainer />
            </div>
        );
    }
});

module.exports = MainWindow;
