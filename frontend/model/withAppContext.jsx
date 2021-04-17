import React from 'react';

import AppContext from './context';

import actions from './actions';

export default withAppContext = (Component) => <AppContext.Consumer>
    {value => <Component {...props} {...value} actions={actions} />}
</AppContext.Consumer>;