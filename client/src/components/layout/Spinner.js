import React, { Fragment } from 'react';
import spinner from '../../img/spinner.gif';

const Spinner = props => {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  );
};

Spinner.propTypes = {};

export default Spinner;
