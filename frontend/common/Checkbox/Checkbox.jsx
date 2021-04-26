import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

export class Checkbox extends React.Component {
    static propTypes = {
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
            <label
                { ...this.props }
                htmlFor={`checkbox-${this.id}`}
                className={`component-checkbox ${this.props.checked ? 'checked' : ''} ${this.props.className}`}
            >
                <input id={`checkbox-${this.id}`} type="checkbox" className="" checked={this.props.checked} onChange={this.props.onChange} />
            </label>
        );
    }
}