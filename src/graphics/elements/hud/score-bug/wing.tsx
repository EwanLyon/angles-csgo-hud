import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Team } from '../../../../types/team-preset';
import { stateType } from '../../../replicant-store';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	height: 86px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${(props: Both): string => (props.right ? 'row-reverse' : 'row')};
	background: var(--bg-col);
`;

const Score = styled.span`
	font-size: 64px;
	font-weight: 600;
	width: 72px;
	text-align: center;
	color: white;
	/* -webkit-text-stroke: 2px ${(props: Both): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')}; */
	/* height: 72px;
	line-height: 68px; */
	margin-bottom: -10px;
`;

const SingleGrid = styled.div`
	display: grid;
`;

const TeamBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	/* margin: ${(props: Both): string => (props.right ? '0 10px 0 0' : '0 0 0 10px')}; */
	margin: 0 10px;
	height: 100%;
    justify-content: space-around;
`;

const TeamName = styled(Text)`
	font-size: 26px;
	max-width: 500px;
	text-transform: uppercase;
	color: white;
	grid-column: 1;
	grid-row: 1;
`;

const TeamLogo = styled.img`
	height: 42px;
	width: auto;
	/* margin: ${(props: OnRightProps) => (props.right ? '0 22px 0 49px' : '0 49px 0 22px')}; */
	grid-column: 1;
	grid-row: 1;
`;

const matchWinsSize = 5;
const MatchWinsBox = styled.div`
	height: 100%;
	width: ${matchWinsSize}px;
	margin: 0 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

const MatchWins = styled.div`
	width: ${matchWinsSize}px;
	/* height: ${matchWinsSize * 5}px; */
	margin: 5px 0;
	flex-grow: 1;
	background: ${(props: MatchWin) => (props.win ? 'white' : '')};
	border: 1px solid white;
`;

const DataBarTriangle = styled.div`
	width: 0;
	height: 0;
	border-top: 86px solid var(--bg-col);
	${(props: OnRightProps) =>
		props.right ? 'border-right: 86px solid transparent' : 'border-left: 86px solid transparent'};
`;

interface MatchWin extends CTProps {
	win?: boolean;
}

interface OnRightProps {
	right?: boolean;
}

interface CTProps {
	ct?: boolean;
}

interface Both extends CTProps, OnRightProps {}

interface Props {
	displayingTeam: Team | undefined;
	oppositeTeam: Team | undefined;
	right?: boolean;
	ct?: boolean;
	score: string;
	matchesWonThisSeries: number;
}

export const Wing: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const matchType = useSelector((state: stateType) => state.currentMatch?.matchType);

	let numberOfBoxes = 0;

	switch (matchType) {
		case 'bo1':
			numberOfBoxes = 1;
			break;
		case 'bo3':
			numberOfBoxes = 2;
			break;
		case 'bo5':
			numberOfBoxes = 3;
			break;
		default:
			break;
	}

	// Fill match boxes
	const matchWinsBoxes: JSX.Element[] = [];
	for (let i = 0; i < numberOfBoxes; i++) {
		matchWinsBoxes.push(<MatchWins key={i} win={props.matchesWonThisSeries >= i + 1} />);
	}

	return (
		<>
			{props.right && <DataBarTriangle right={props.right} />}
			<Container right={props.right} ct={props.ct}>
				<TeamBox>
					<SingleGrid>
						{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
						<TeamLogo src={props.displayingTeam?.logo || ''} right={props.right} />
						<TeamLogo src={props.oppositeTeam?.logo || ''} right={props.right} style={{ opacity: 0 }} />
					</SingleGrid>

					<SingleGrid>
						{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
						<TeamName
							style={{ visibility: 'hidden', textShadow: 'none' }}
							text={props.oppositeTeam?.name || ''}
						/>

						<TeamName text={props.displayingTeam?.name || ''} />
					</SingleGrid>
				</TeamBox>

				<Score right={props.right} ct={props.ct}>
					{props.score}
				</Score>
				<MatchWinsBox>{matchWinsBoxes}</MatchWinsBox>
			</Container>
			{!props.right && <DataBarTriangle right={props.right} />}
		</>
	);
});

Wing.displayName = 'ScoreBugWing';
