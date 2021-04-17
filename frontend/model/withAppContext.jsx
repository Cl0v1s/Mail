import React from 'react';

import AppContext from './context';


export default withAppContext = (Component) => <AppContext.Consumer>
    {value => <Component {...props} {...value} />}
</AppContext.Consumer>;