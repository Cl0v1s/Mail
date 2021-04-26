import React from 'react';
import PropTypes from 'prop-types';

import './Select.scss';

export class Select extends React.Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })).isRequired,
        value: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        name: '',
        value: '',
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }

        this.options = React.createRef();
    }

    componentWillUnmount() {

    }

    attachEvents = () => setTimeout(() => {
        document.body.addEventListener('click', this.onClose);
    }, 200);

    detachEvents = () => {
        document.body.removeEventListener('click', this.onClose);
    }

    onOpen = () => {
        this.attachEvents();
        this.setState({
            open: true,
        });
    }

    onClose = (evt) => {
        if(evt) {
            if(this.options.current.contains(evt.target)) return;
            evt.stopPropagation();
        }
        this.detachEvents();
        this.setState({
            open: false,
        });
    }

    onChange = (option) => {
        this.props.onChange({
            [this.props.name]: option.value, 
        });
        this.onClose();
    }

    renderOption(option, index, onClick = null) {
        return <option key={index} onClick={onClick ? () => onClick(option) : null } className="p-1" value={option.value}>{option.label}</option>;
    }

    render() {
        return (
            <div
                className={`component-select ${this.props.className}`}
                name={this.props.name}
            >
                <div className="value py-1 px-2" onClick={this.state.open == false ? this.onOpen : null}>
                    <div>
                        { this.props.value ? this.renderOption(this.props.options.find((opt) => opt.value === this.props.value)) : this.renderOption(this.props.options[0], 'default') }
                    </div>
                    <div>
                        <span className="fa fa-caret-down"></span>
                    </div>
                </div>
                {
                    this.state.open && <div className="options" ref={this.options}>
                        { this.props.options.map((option, index) => this.renderOption(option, index, this.onChange)) }
                    </div>
                }
            </div>
        )
    }
}