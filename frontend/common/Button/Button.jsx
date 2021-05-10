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
export const ButtonOutline = (props) => <Button
    className={ "component-button--outline " + props.className  }
    onClick={props.onClick}>
    {props.children}
</Button>;