import React from 'react';
import PropTypes from 'prop-types';

import './Select.css';

export class Select extends React.Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
        value: PropTypes.string,
    }

    static defaultProps = {
        value: '',
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }
    }

    renderOption(option) {
        return <option value={option.value}>{option.label}</option>;
    }

    render() {
        return (
            <div
                className={`component-select p-2 ${this.props.className}`}
            >
                <div className="value">
                    <div>
                        { this.props.value ? this.renderOption(this.props.options.find((opt) => opt.value === this.props.value)) : this.renderOption(this.props.options[0]) }
                    </div>
                    <div>
                        <span className="fa fa-caret-down"></span>
                    </div>
                </div>

            </div>
        )
    }
}