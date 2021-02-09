import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { useSelector } from 'react-redux';

// Import { useReplicant } from 'use-nodecg';
// import { CSGOOutput, MatchStats, Weapon } from '../../types/csgo-gsi';
import { DummyProducer } from '../../extensions/dummyData';
// Import { TeamData } from '../../types/extra-data';
import { Producer } from '../../types/producer';
import { stateType } from '../replicant-store';

import { ScoreBug } from '../elements/hud/score-bug/score-bug';
import { Player } from '../elements/hud/player/player';
import { CurrentPlayer } from '../elements/hud/current-player/current-player';
import { TeamEco } from '../elements/hud/in-game-stats/team-eco';
import { TeamNade } from '../elements/hud/in-game-stats/team-nades';
import { Killfeed } from '../elements/hud/killfeed/killfeed';

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: 'Josefin Sans';
`;

const PlayerList = styled.div`
	& > * {
		margin: 10px 0;
	}
`;

const LeftSide = styled(PlayerList)`
	position: absolute;
	left: 25px;
	top: 566px;
`;
const RightSide = styled(PlayerList)`
	position: absolute;
	right: 25px;
	top: 566px;
`;

const GameStats = styled.div`
	& > * {
		margin: 5px 0;
	}
	top: 444px;
	display: flex;
	flex-direction: column;
	width: 340px;
`;

const LeftGameStats = styled(GameStats)`
	position: absolute;
	left: 25px;
`;

const RightGameStats = styled(GameStats)`
	position: absolute;
	right: 25px;
	align-items: flex-end;
`;

const Current = styled(CurrentPlayer)`
	position: absolute;
	left: 588px;
	bottom: 50px;
`;

// Const BombPlantedStyled = styled(BombPlanted)`
// 	position: absolute;
// 	top: 110px;
// 	left: 633px;
// `;

// Returns true if teamOne should be T's
function currentTeamSide(round: number): boolean {
	if (round < 15) {
		return true;
	}

	if (round >= 30) {
		// Overtime math
		return Boolean(Math.floor((round - 27) / 6) % 2);
	}

	return false;
}

export const HUD: React.FunctionComponent = () => {
	const allPlayers = useSelector((state: stateType) => state.allPlayers);
	const swapTeams = useSelector((state: stateType) => state.swapTeams);
	const matchStats = useSelector((state: stateType) => state.matchStats);
	const phase = useSelector((state: stateType) => state.phase);
	const gameSettings = useSelector((state: stateType) => state.gameSettings);
	// const gameSgs = useSelector((state: stateType) => state.game);
	// console.log(gameSgs);

	const [producerRep] = useReplicant<Producer, Producer>('producer', DummyProducer);
	const scoreBugRef = useRef<HTMLDivElement>(null);
	const [, setScoreBugWidth] = useReplicant<number, number>('scoreBugWidth', 1920);
	const [localShowEco, setLocalShowEco] = useState(false);
	const [localShowNades, setLocalShowNades] = useState(false);

	const ct = swapTeams ? currentTeamSide(matchStats.round) : !currentTeamSide(matchStats.round);
	const nadeBombTime = gameSettings.bombTime - 5;

	useEffect(() => {
		// Automatic bomb and eco
		if (
			phase.phase === 'bomb' &&
			!localShowNades &&
			parseInt(phase.phase_ends_in, 10) > nadeBombTime
		) {
			setLocalShowNades(true);
		} else if (
			phase.phase === 'bomb' &&
			localShowNades &&
			parseInt(phase.phase_ends_in, 10) <= nadeBombTime
		) {
			setLocalShowNades(false);
		}

		if (phase.phase === 'freezetime' && (!localShowNades || !localShowEco)) {
			setLocalShowEco(true);
			setLocalShowNades(true);
		}

		if (phase.phase === 'live' && (localShowNades || localShowEco)) {
			setLocalShowEco(false);
			setLocalShowNades(false);
		}
	}, [localShowEco, localShowNades, nadeBombTime, phase]);

	const leftPlayers: JSX.Element[] = [];
	const rightPlayers: JSX.Element[] = [];

	// This is really ugly
	allPlayers.forEach((player) => {
		if (swapTeams) {
			if (player.observer_slot <= 5) {
				leftPlayers.push(<Player steamId={player.steamId} key={player.steamId} />);
			} else {
				rightPlayers.push(<Player steamId={player.steamId} key={player.steamId} right />);
			}
		} else if (player.observer_slot > 5) {
			leftPlayers.push(<Player steamId={player.steamId} key={player.steamId} />);
		} else {
			rightPlayers.push(<Player steamId={player.steamId} key={player.steamId} right />);
		}

		return undefined;
	});

	// Get value to move the map up or down
	if (scoreBugRef.current) {
		setScoreBugWidth(scoreBugRef.current.offsetWidth);
	}

	return (
		<Container>
			<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
				<div ref={scoreBugRef}>
					<ScoreBug />
				</div>
			</div>

			<LeftSide>{leftPlayers}</LeftSide>
			<RightSide>{rightPlayers}</RightSide>

			<LeftGameStats>
				<TeamEco
					show={producerRep.teamEco || localShowEco}
					ct={ct}
					teamTwo={swapTeams}
				/>
				<TeamNade
					ct={ct}
					teamTwo={swapTeams}
					show={producerRep.teamNades || localShowNades}
				/>
			</LeftGameStats>

			<RightGameStats>
				<TeamEco
					show={producerRep?.teamEco || localShowEco}
					ct={!ct}
					right
					teamTwo={!swapTeams}
				/>
				<TeamNade
					ct={!ct}
					right
					show={producerRep?.teamNades || localShowNades}
					teamTwo={!swapTeams}
				/>
			</RightGameStats>

			<Current />

			<Killfeed />
		</Container>
	);
};
