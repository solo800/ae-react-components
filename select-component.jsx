/* eslint no-unused-vars: 0 */
const React = require('react');
const typeChecker = require('../../javascript/modules/lp-util')().typeChecker;

/**
 * @param {array}{object} options
 *
 * option object structure
 * {
 *   {string} Title
 *   {array}{object} Attributes
 * }
 *
 * attribute object structure
 * {
 *   {string} Title
 *   {string} FilterTitle
 * }
 *
 * @method {undefined} handleClick
 * @method {*} onClickCallback (will be called if default handleClick method is not overridden
 */
class Select extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            open: typeChecker(props.open, 'boolean') ? props.open : false,
            selectedOption: '',
            isOpen: false,
            parentElement: null,
            parentHeight: '',
        };

        // ref instances
        // self = Select htmlElement .option-list

        // public
        this.handleClick = typeChecker(props.handleClick, 'function') ? props.handleClick.bind(this) : this.handleClick.bind(this);
        this.onClickCallback = typeChecker(props.onClickCallback, 'function') ? props.onClickCallback.bind(this) : this.onClickCallback.bind(this);

        // private
        this.setOpenState = this.setOpenState.bind(this);
    }

    // custom methods
    handleClick (event) {
        event.preventDefault();

        this.state.parentElement.style.height = this.setOpenState() ? '' : this.state.parentHeight;

        const selectedOption = typeChecker(event.target.getAttribute('value'), 'string') ? event.target.getAttribute('value') : '';
        this.setState(prevState => {
            return {
                open: !prevState.open,
                selectedOption: selectedOption,
            };
        });

        this.onClickCallback(event);
    }

    onClickCallback (event) {
        // pass
    }

    setOpenState () {
        const isOpen = null !== this.self.getAttribute('open');
        this.setState({isOpen});

        return isOpen;
    }

    // lifecycle methods
    componentWillReceiveProps (newProps) {
        // make sure to reset the selected option
        this.setState({selectedOption: ''});
    }

    componentDidMount () {
        this.setState({
            parentElement: this.self.parentElement,
            parentHeight: window.getComputedStyle(this.self.parentElement).getPropertyValue('height'),
        });
    }

    render () {
        return (
            <div
                // set a reference to this dom element on this object
                // eslint-disable-next-line brace-style
                ref={elem => { this.self = elem; }}
                className='option-list'
                onClick={this.handleClick}
                open={this.state.open}
            >
                <span className='option-title' show={'' === this.state.selectedOption ? 'true' : undefined}>
                    {this.props.options.title}
                </span>

                {this.props.options.list.map((option, i) => {
                    return <span
                        className='option'
                        key={i}
                        value={option.Title}
                        show={option.Title === this.state.selectedOption ? 'true' : undefined}
                    >{option.Title}</span>
                })}

                <span className='select-icon'></span>
            </div>
        );
    }
}

Select.defaultProps = {
    options: {
        title: '--',
        list: [],
    },
};

module.exports = Select;
