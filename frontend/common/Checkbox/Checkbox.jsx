import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.css';

export class Checkbox extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        checked: PropTypes.bool,
    }

    static defaultProps = {
        className: '',
        checked: false,
    }

    id = Math.floor(Math.random() * 100);

    render() {
        return (
            <label htmlFor={`checkbox-${this.id}`} className={`component-checkbox ${this.props.checked ? 'checked' : ''} ${this.props.className}`}>
                <input id={`checkbox-${this.id}`} type="checkbox" className="" checked={this.props.checked} onChange={this.props.onChange} />
            </label>
        );
    }
}