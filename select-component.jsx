/* eslint no-unused-vars: 0 */
const React = require('react');

// lp-util and it's typeChecker method are not included here, this library however was written primarily by solo800
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
    /**
     * sets the height of the parent element of the select when it is clicked so as to ensure the container does not expand to 
     * the size of all the options but instead retains its originally rendered height
     * sets the open state of the element
     * sets the option that was selected (selected option is set but it will be the same as the title of the select if this is
     * an initial click on the select to open it or an option is already selected
     */
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

    /**
     * a method that can be used by the component utilizing the select component to run code without affecting the native behavior
     * of the select component
     */
    onClickCallback (event) {
        // pass
    }

    setOpenState () {
        const isOpen = null !== this.self.getAttribute('open');
        this.setState({isOpen});

        return isOpen;
    }

    // lifecycle methods
    // if the select element is receiving an updated set of options make sure that none of them are selected
    componentWillReceiveProps (newProps) {
        // make sure to reset the selected option
        this.setState({selectedOption: ''});
    }

    // saves the initially rendered height of the select so that it can be used later to lock the height of the select component
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
