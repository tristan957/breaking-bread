// tslint:disable: no-unsafe-any
import React from "react";
import Autosuggest from "react-autosuggest";
import Tag from "../entities/Tag";
import theme from "./resources/css/AutoSuggestionSearchBar.css";

// const theme = {
//   container: {
//     position: 'relative'
//   },
//   input: {
//     width: 240,
//     height: 30,
//     padding: '10px 20px',
//     fontFamily: 'Helvetica, sans-serif',
//     fontWeight: 300,
//     fontSize: 16,
//     border: '1px solid #ce8650',
//     borderTopLeftRadius: 4,
//     borderTopRightRadius: 4,
//     borderBottomLeftRadius: 4,
//     borderBottomRightRadius: 4,
//   },
//   inputFocused: {
//     outline: 'none'
//   },
//   inputOpen: {
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0
//   },
//   suggestionsContainer: {
//     display: 'none'
//   },
//   suggestionsContainerOpen: {
//     display: 'block',
//     position: 'absolute',
//     top: 51,
//     width: 280,
//     border: '1px solid #aaa',
//     backgroundColor: '#fff',
//     fontFamily: 'Helvetica, sans-serif',
//     fontWeight: 300,
//     fontSize: 16,
//     borderBottomLeftRadius: 4,
//     borderBottomRightRadius: 4,
//     zIndex: 2
//   },
//   suggestionsList: {
//     margin: 0,
//     padding: 0,
//     listStyleType: 'none',
//   },
//   suggestion: {
//     cursor: 'pointer',
//     padding: '10px 20px'
//   },
//   suggestionHighlighted: {
//     backgroundColor: '#ddd'
//   }
// };

const languages: Tag[] = [
	{
		name: "indian",
		id: 1,
	},
	{
		name: "polygamy",
		id: 2,
	},
	{
		name: "puke",
		id: 12,
	},
	{
		name: "cannibol",
		id: 232,
	},
	{
		name: "cat",
		id: 666,
	},
	{
		name: "vegan",
		id: 129,
	},
	{
		name: "veget",
		id: 2329,
	},
];

const getSuggestions = (value: String) => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : languages.filter(lang =>
		lang.name.toLowerCase().slice(0, inputLength) === inputValue
	);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion: Tag) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion: Tag) => (
	<div>
		#{suggestion.name}
	</div>
);

interface IAppState {
	value: string;
	suggestions: Tag[];
}

export default class AutoCompletionSearchBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			value: "",
			suggestions: [],
		};
	}

	// tslint:disable-next-line: no-any
	public onChange(event: React.FormEvent<any>, { newValue, method }: Autosuggest.ChangeEvent): void {
		this.setState({ value: newValue });
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	// tslint:disable-next-line: no-any
	public onSuggestionsFetchRequested({ value }: any): void {
		this.setState({
			suggestions: getSuggestions(value),
		});
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	public onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	}

	public render(): JSX.Element {
		const { value, suggestions }: IAppState = this.state;

		return (
			<Autosuggest
				id="asdfafsd"
				theme={theme}
				// focusInputOnSuggestionClick={!isMobile}
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={renderSuggestion}
				inputProps={{
					placeholder: `search tag`,
					value,
					onChange: (e, changeEvent) => this.onChange(e, changeEvent),
				}}
			/>
		);
	}
}