import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

import { stateType } from '../../../replicant-store';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import Grid from '@material-ui/core/Grid';
import { Wing } from './wing';
import { Time } from './time';
import { BombPlanted } from './bomb-planted';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Hub = styled.div`
	background: var(--bg-col);
	color: #fff;
	width: 115px;
	height: 86px;
	background-size: 13px 13px;
	z-index: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	padding: 10px 0;
	box-sizing: border-box;
`;

const Round = styled(Text)`
	font-size: 19px;
`;

const OTText = styled(Round)`
	max-width: 52px;
`;

const bombShowPos = 90;
const bombHidePos = 40;

const BombPlantedStyled = styled(BombPlanted)`
	position: absolute;
	top: ${bombHidePos}px;
`;

interface Props {
	style?: React.CSSProperties;
}

const bombConditions = ['planting', 'planted', 'defusing', 'defused', 'exploded'];


function currentTeamSide(round: number) {
	if (round < 15) {
		return true;
	}

	if (round >= 30) {
		// Overtime math
		return Boolean(Math.floor((round - 27) / 6) % 2);
	}

	return false;
}

export const ScoreBug: React.FunctionComponent<Props> = (props: Props) => {
	const bomb = useSelector((state: stateType) => state.bomb);
	const phase = useSelector((state: stateType) => state.phase);
	const round = useSelector((state: stateType) => state.game.round);
	const matchStats = useSelector((state: stateType) => state.matchStats);
	const teamOne = useSelector((state: stateType) => state.teamOne);
	const teamTwo = useSelector((state: stateType) => state.teamTwo);
	const swapTeams = useSelector((state: stateType) => state.swapTeams);
	const gameAllPlayers = useSelector((state: stateType) => state.game.allplayers);
	const currentMatch = useSelector((state: stateType) => state.currentMatch);

	const time = parseFloat(phase.phase_ends_in);
	const tl = useRef<gsap.core.Timeline>();
	const bombElement = useRef<HTMLDivElement>(null);
	const [currentRound, setCurrentRound] = useState(0);

	console.log(round);
	const roundWinner = round.win_team || '';

	const ct = !currentTeamSide(currentRound);

	let otText: JSX.Element | null = null;
	if (matchStats.round >= 30) {
		otText = (
			<div
				style={{
					fontSize: 25,
					display: 'flex',
					justifyContent: 'space-around',
					width: 102,
				}}>
				<OTText
					text={`OT${Math.ceil((matchStats.round - 29) / 6)}`}
					style={{ fontStyle: 'italic', lineHeight: '34px' }}
				/>
				<OTText text={`${matchStats.round - 29 - ~~((matchStats.round - 30) / 6) * 6}/6`} />
			</div>
		);
	}

	const bombAnimation = (stage: string): void => {
		if (tl.current) {
			const currentTime = tl.current.time();
			const labelTime = tl.current.labels[stage];

			tl.current.resume();
			if (currentTime >= labelTime) {
				tl.current.play(labelTime);
			} else {
				gsap.to(tl.current, {
					duration: 0.3,
					time: labelTime,
					ease: 'none',
					onComplete: () => {
						if (tl && tl.current) {
							tl.current.resume();
						}
					},
				});
			}
		}
	};

	useEffect(() => {
		// No bomb in warmup
		if (bomb === undefined) {
			return;
		}

		if (bomb.state === 'planting') {
			bombAnimation('ShowBomb');
		} else if (bomb.state === 'exploded' || bomb.state === 'defused') {
			bombAnimation('HideBomb');
		}
	}, [bomb.state]);

	// Create timeline
	useEffect(() => {
		tl.current = gsap.timeline({ paused: true });

		// Console.log('instantiating timeline');

		tl.current.addLabel('ShowBomb');

		tl.current.set(bombElement.current, { top: bombHidePos, opacity: 0 });
		tl.current.to(bombElement.current, { top: bombShowPos, opacity: 1 });

		tl.current.addPause('+=0.1');

		tl.current.addLabel('HideBomb');

		tl.current.set(bombElement.current, { top: bombShowPos, opacity: 1 });
		tl.current.to(bombElement.current, { top: bombHidePos, opacity: 0 });
	}, []);

	useEffect(() => {
		if (phase.phase === 'freezetime' && currentRound !== matchStats.round) {
			setCurrentRound(matchStats.round);
		}
	}, [currentRound, matchStats.round, phase.phase]);

	let hasKit = false;
	let playerName = '';
	if (bomb.player) {
		hasKit = Boolean(gameAllPlayers[bomb.player]?.state.defusekit);
		playerName = gameAllPlayers[bomb.player]?.name;
	}

	return (
		<Container style={props.style}>
			<Grid container direction={swapTeams ? 'row-reverse' : 'row'} justify="center" alignItems="center">
				<Wing
					displayingTeam={currentMatch?.teamA}
					oppositeTeam={currentMatch?.teamB}
					ct={ct}
					right={swapTeams}
					score={teamOne.score.toString()}
					matchesWonThisSeries={teamOne.matchesWonThisSeries}
				/>
				<Hub>
					{otText ? otText : <Round text={`ROUND ${currentRound + 1}/30`} />}
					<Time phase={phase.phase} time={time} roundWin={roundWinner} />
				</Hub>
				<Wing
					displayingTeam={currentMatch?.teamB}
					oppositeTeam={currentMatch?.teamA}
					ct={!ct}
					right={!swapTeams}
					score={teamTwo.score.toString()}
					matchesWonThisSeries={teamTwo.matchesWonThisSeries}
				/>
			</Grid>
			<BombPlantedStyled
				phase={bomb?.state || 'carried'}
				playerName={playerName}
				kit={hasKit}
				ref={bombElement}
				style={bombConditions.includes(bomb?.state) ? {} : { display: 'none' }}
			/>
		</Container>
	);
};
