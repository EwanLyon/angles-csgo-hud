import React from 'react';
import { render } from 'react-dom';

// React imports
import { theme } from './theme';
import { Button, ButtonGroup, withStyles, Theme, Grid } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

// Interfaces

const ShowButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(green[600]),
		backgroundColor: green[600],
		'&:hover': {
			backgroundColor: green[400],
		},
	},
}))(Button);

const HideButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(red[600]),
		backgroundColor: red[600],
		'&:hover': {
			backgroundColor: red[400],
		},
	},
}))(Button);

export const Elements: React.FunctionComponent = () => {
	function showElement(elementName: string): void {
		console.log('Showing ' + elementName);
		nodecg.sendMessage('basicShow', elementName);
	}

	function hideElement(elementName: string): void {
		console.log('Hiding ' + elementName);
		nodecg.sendMessage('basicHide', elementName);
	}

	return (
		<ThemeProvider theme={theme}>
			<Grid container>
				<ButtonGroup fullWidth style={{ marginBottom: 8 }}>
					<ShowButton onClick={(): void => showElement('teamEco')}>Team Eco</ShowButton>
					<HideButton onClick={(): void => hideElement('teamEco')}>Team Eco</HideButton>
				</ButtonGroup>
				<ButtonGroup fullWidth>
					<ShowButton onClick={(): void => showElement('teamNades')}>Team Nades</ShowButton>
					<HideButton onClick={(): void => hideElement('teamNades')}>Team Nades</HideButton>
				</ButtonGroup>
			</Grid>
		</ThemeProvider>
	);
};

render(<Elements />, document.getElementById('elements'));
