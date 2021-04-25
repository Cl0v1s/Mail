import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';

export class Input extends React.Component {
    static STATES = {
        DISABLED: 'disabled',
    }

    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        className: '',
    }

    render() {
        return (
            <input placeholder={this.props.placeholder} disabled={this.props.className.indexOf(Input.STATES.DISABLED) !== -1 } className={`component-input ${this.props.className}`} type="text" onChange={this.props.onChange} />
        )
    }
}