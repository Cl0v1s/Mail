import React from 'react';

import AppContext from './context';


const withAppContext = (Component) => (props) => <AppContext.Consumer>
    {value => <Component {...props} {...value} />}
</AppContext.Consumer>;

export default withAppContext;