import React from 'react';
import PropTypes from 'prop-types';

import theme from './../theme';

class Button extends React.Component {
    static propTypes = {
        background: PropTypes.string,
        text: PropTypes.string.isRequired,
        border: PropTypes.string,
        onClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        background: 'transparent',
        border: 'transparent',
    }

    render() {
        return (
            <button
                className="component-button"
                style={{
                    backgroundColor: this.props.background,
                    color: this.props.text,
                    border: '1px solid transparent',
                    borderRadius: theme.borders.radius,
                    borderColor: this.props.border,
                }}
                onClick={this.props.onClick}
            >
                { this.props.children }
            </button>
        )
    }
};

export const ButtonPrimary = (props) => <Button
    background={theme.colors.primary}
    text={theme.colors.dark}
    onClick={props.onClick}>
        {props.children}
    </Button>;

export const ButtonSecondary = (props) => <Button
    background={theme.colors.secondary}
    text={theme.colors.dark}
    onClick={props.onClick}>
        {props.children}
    </Button>;

export const ButtonPrimaryOutline = (props) => <Button
    border={theme.colors.primary}
    text={theme.colors.primary}
    onClick={props.onClick}>
        {props.children}
    </Button>;

export const ButtonSecondaryOutline = (props) => <Button
    border={theme.colors.secondary}
    text={theme.colors.secondary}
    onClick={props.onClick}>
        {props.children}
    </Button>;