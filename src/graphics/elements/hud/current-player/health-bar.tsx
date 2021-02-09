import React from 'react';
import styled from 'styled-components';
// @ts-ignore
import Twemoji from 'react-twemoji';
import Grid from '@material-ui/core/Grid';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import { Armour } from '../../atoms/armour';
import { ProgressBarBox } from '../../atoms/progress-bar-box';

const Container = styled(ProgressBarBox)`
	height: 64px;
	width: ${606 + 137}px;
	border-bottom: 0px;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.32);
	clip-path: polygon(0 0, 100% 0, 91.5% 100%, 8.5% 100%);
`;

const ArmourBar = styled(ProgressBarBox)`
	width: 89%;
	height: 12px;
	z-index: 1;
	margin-left: 42px;
`;

const HealthBarInfo = styled.div`
	display: flex;
	align-items: center;
	flex-grow: 1;
	justify-content: space-between;
	margin-top: ${(props: HealthBarInfoProps): string => (props.nonCenterText ? '0' : '5px')};
	padding: 0 20px 0 56px;
`;

const PlayerName = styled(FitText)`
	justify-content: flex-start !important;
	color: #fff;
	font-size: 40px;
	line-height: 52px;
	max-width: 400px;
	& > ${FitTextText} {
		transform-origin: left !important;
	}
	margin-bottom: -9px;
`;

const HealthArmourRaw = styled.div`
	width: 113px;
	height: 52px;
	display: flex;
	align-items: center;
	color: #fff;
	font-size: 40px;
	font-weight: bold;
	margin: 0 12px;
`;

const ArmourImg = styled(Armour)`
	height: 35px;
	width: auto;
	margin-right: 4px;
`;

const HealthImg = styled.img`
	height: 35px;
	width: auto;
	margin-right: 4px;
`;

const RealNamePlayerName = styled(FitText)`
	font-size: 25px;
	max-width: 400px;
	& > ${FitTextText} {
		transform-origin: left !important;
	}
	justify-content: flex-start !important;
	margin-top: 2px;
`;

const RealName = styled(FitText)`
	& > ${FitTextText} {
		transform-origin: left !important;
	}
	justify-content: flex-start !important;
`;

const CountryFlagWithRealName = styled(Twemoji)`
	& > .emoji {
		height: 24px;
		margin-right: 7px;
		margin-bottom: -5px;
	}
`;

const CountryFlag = styled(Twemoji)`
	& > .emoji {
		height: 50px;
		margin: 0 7px -5px 3px;
	}
`;

interface HealthBarInfoProps {
	nonCenterText?: boolean;
}

interface Props {
	health: number;
	armour: number;
	player: string;
	ct?: boolean;
	armourType: 'helmet' | 'normal';
	nonCenterText?: boolean;
	realName?: string;
	country?: string;
}

export const HealthBar: React.FunctionComponent<Props> = (props: Props) => {
	const HealthBarChildren: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
	};

	// BoxShadow: `inset 0 0 10px ${isCT ? 'var(--ct-col)' : 'var(--t-col)'}`,
	const healthBarColour: React.CSSProperties = {
		background: `linear-gradient(to left, ${props.ct ? 'var(--ct-col)' : 'var(--t-col)'}, ${
			props.ct ? 'var(--ct-col)' : 'var(--t-col)'
		} ${100 - props.health + 5}%) `,
	};

	const ArmourBarStyle: React.CSSProperties = {
		border: `1px solid #fff`,
		boxSizing: 'border-box',
		background: '#fff',
		opacity: props.armour === 0 ? '0' : '1',
	};

	let playerNameElement;
	if (props.realName) {
		if (props.country) {
			playerNameElement = (
				<Grid container direction="column" justify="space-evenly">
					<RealNamePlayerName text={props.player} />
					<Grid style={{marginLeft: 8}} container item alignItems="center">
						<CountryFlagWithRealName options={{ folder: 'svg', ext: '.svg' }}>
							{props.country}
						</CountryFlagWithRealName>
						<RealName text={props.realName} />
					</Grid>
				</Grid>
			);
		} else {
			playerNameElement = (
				<Grid container direction="column" justify="space-evenly">
					<RealNamePlayerName text={props.player} />
					<RealName style={{marginLeft: 8}} text={props.realName} />
				</Grid>
			);
		}
	} else if (props.country) {
		playerNameElement = (
			<Grid container alignItems="center">
				<CountryFlag>{props.country}</CountryFlag>
				<PlayerName text={props.player} />
			</Grid>
		);
	} else {
		playerNameElement = <PlayerName text={props.player} />;
	}

	return (
		<Container
			progressBarStyle={healthBarColour}
			childrenStyle={HealthBarChildren}
			progress={props.health}>
			<HealthBarInfo nonCenterText={props.nonCenterText}>
				{playerNameElement}
				<div style={{ display: 'flex' }}>
					<HealthArmourRaw>
						{/* Health */}
						<HealthImg src={require('../../../images/in-game/Health.svg')} />
						<span style={{ marginBottom: -8 }}>{props.health}</span>
					</HealthArmourRaw>
					<HealthArmourRaw>
						{/* Armour */}
						<ArmourImg item={props.armourType} />
						<span style={{ marginBottom: -8 }}>{props.armour}</span>
					</HealthArmourRaw>
				</div>
			</HealthBarInfo>
			<ArmourBar progress={props.armour} progressBarStyle={ArmourBarStyle} />
		</Container>
	);
};
