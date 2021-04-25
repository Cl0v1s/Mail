import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

export class Button extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        className: '',
    }

    render() {
        return (
            <button
                className={"component-button p-2 " + this.props.className}
                onClick={this.props.onClick}
            >
                { this.props.children}
            </button>
        )
    }
};

export const ButtonPrimary = (props) => <Button
    className="component-button--primary"
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonSecondary = (props) => <Button
    className="component-button--secondary"
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonPrimaryOutline = (props) => <Button
    className="component-button--primary component-button--outline"
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonSecondaryOutline = (props) => <Button
    className="component-button--secondary component-button--outline"
    onClick={props.onClick}>
    {props.children}
</Button>;