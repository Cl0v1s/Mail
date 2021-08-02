import React from 'react';

import AppContext from './context';
import { Folder, Mails, Account } from './actions';


export default class withAppContext extends React.Component {

    render() {
        return (
            <AppContext.Consumer>
                { value => <Component
                    {...props}
                    {...value} 
                    actions = {
                        
                    }
                /> }
            </AppContext.Consumer>
        );
    }
}

const withAppContext = (Component) => (props) => ;

export default withAppContext;