import React from "react";
import { connect } from "react-redux";
// Import F7 Bundle
import Framework7 from "framework7/framework7-lite.esm.bundle.js";
// Import F7-React Plugin
import Framework7React, { App, View } from "framework7-react";
import { compose } from "redux";

import { F7_INIT, IApplicationStore } from "./store/rootReducer";

// Init F7-React Plugin
Framework7.use(Framework7React);

type Props = { initF7?(f7instance: Framework7): void };

class F7Wrapper extends React.Component<Props, { inited: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inited: false,
    };
  }

  componentDidMount() {
    this.$f7ready((f7) => {
      this.props.initF7(f7);
      this.setState({ inited: true });
    });
  }

  render() {
    return (
      <App params={{ theme: "auto", name: "My App", id: "com.demoapp.test" }}>
        {this.state.inited && <View main>{this.props.children}</View>}
      </App>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  session: state.sessionReducer,
});

const mapDispatchToProps = (dispatch) => ({
  initF7: (f7: Framework7) => dispatch({ type: F7_INIT, f7 }),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(F7Wrapper);
