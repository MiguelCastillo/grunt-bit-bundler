import React from "react";

class ReactApp extends React.Component {
  constructor(props) {
    super(props);
    console.log("init app");
  }

  render() {
    return (
      <div className="ReactApp">Hello world</div>
    );
  }
}

export default ReactApp;
