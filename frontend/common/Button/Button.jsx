import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

export class Button extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired
    };

    render() {
        return (
            <button
                { ...this.props }
                className={"component-button p-2 " + this.props.className}
            >
                { this.props.children}
            </button>
        )
    }
};

export const ButtonPrimary = (props) => <Button
    className={ "component-button--primary " + props.className }
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonSecondary = (props) => <Button
    className={ "component-button--secondary " + props.className }
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonPrimaryOutline = (props) => <Button
    className={ "component-button--primary component-button--outline " + props.className  }
    onClick={props.onClick}>
    {props.children}
</Button>;

export const ButtonSecondaryOutline = (props) => <Button
    className={ "component-button--secondary component-button--outline " + props.className }
    onClick={props.onClick}>
    {props.children}
</Button>;