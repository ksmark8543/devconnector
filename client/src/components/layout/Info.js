import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Info = props => {
  console.log(props);
  return <div>info</div>;
};

const mapStateToProps = state => ({
  info: state.alert,
});

export default connect(mapStateToProps)(Info);
