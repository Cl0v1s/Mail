import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

export class Input extends React.Component {
    static STATES = {
        DISABLED: 'disabled',
    }

    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        state: PropTypes.oneOf(Object.values(Input.STATES)),
    }

    static defaultProps = {
        state: null,
    }

    render() {
        return (
            <input
                { ...this.props }
                placeholder={this.props.placeholder}
                disabled={this.props.state === Input.STATES.DISABLED }
                className={`component-input ${this.props.className}`}
                type="text"
                onChange={this.props.onChange} 
            />
        )
    }
}