var AnotherComponent = require('./anotherComponent');

var AComponent = React.createClass({
  render: function() {
    return (
      <div>
        <h1>REACTION!</h1>
        <h2>xxxxxxx</h2>
        <AnotherComponent />
      </div>
    )
  }
});

module.exports = AComponent;
