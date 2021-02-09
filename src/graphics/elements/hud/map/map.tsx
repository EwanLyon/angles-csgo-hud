import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import equal from 'fast-deep-equal/react';
import { useSelector } from 'react-redux';

import { stateType } from '../../../replicant-store';
import { MapData } from './map-data';
import { MapImages, MapList } from '../../atoms/map-images';

import { SelectedMaps } from './selected-maps';
import { Grenade } from './grenade';
import { PlayerIcon, CarriedBombIcon, DroppedBombIcon, DeadPlayer, FlashingBomb } from './player-icon';
// import { PlayerShooting } from './player-shooting';

const MapContainer = styled.div``;

const MapImage = styled(MapImages)`
	position: absolute;
	height: inherit;
	width: inherit;
`;

const PlayerHolder = styled.div`
	position: absolute;
	height: inherit;
	width: inherit;
`;

interface Props {
	showScore?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

function scaleTo100(num: number, inMin: number, inMax: number): number {
	return ((num - inMin) * 100) / (inMax - inMin);
}

interface TempNades {
	key: string;
	type: 'frag' | 'flashbang';
	position: string;
}

export const Map: React.FC<Props> = (props: Props) => {
	const map = useSelector((state: stateType) => state.matchStats.name);
	const allPlayers = useSelector((state: stateType) => state.allPlayers);
	const interpMapPlayersLocations = useSelector((state: stateType) => state.interpMapPlayers);
	const bomb = useSelector((state: stateType) => state.bomb);
	const mapPhase = useSelector((state: stateType) => state.phase.phase); // Just to reset flashFragGrenades elements
	const observedPlayerID = useSelector((state: stateType) => state.observingPlayer.steamid);
	const mapData = useSelector((state: stateType) => state.currentMatch);
	const grenades = useSelector((state: stateType) => state.mapGrenades);

	// // Frags and flashes occur when the nade dies so we need to know when that happens
	const [tempGrenades, setTempGrenades] = useState<TempNades[]>([]);
	const [curGrenades, setCurGrenades] = useState<JSX.Element[]>([]);
	const [flashFragGrenades, setFlashFragGrenades] = useState<JSX.Element[]>([]);
	const [usedFrags, setUsedFrags] = useState<string[]>([]);
	const [resetNades, setResetNades] = useState(false);

	let mapName = map;
	if (typeof MapData[map] === 'undefined') {
		// Try to see if workshop map
		const mapNameArray = map.split('/');
		mapName = mapNameArray[mapNameArray.length - 1];
	}

	const currentMap = MapData[mapName];

	const playerIconMap: JSX.Element[] = [];
	for (const [, player] of Object.entries(interpMapPlayersLocations)) {
		const posArray = player.position || [0, 0, 0];

		if (player.health === 0) {
			playerIconMap.push(<DeadPlayer map={currentMap} ct={player.ct} position={posArray} key={player.steamId} />);
			continue;
		}

		// const rotationArray = currentPlayerPos[player.steamId]?.rotation || [0, 0, 0];
		const rotationArray = player.rotation || [0, 0, 0];

		if (bomb?.player === player.steamId && bomb?.state !== 'dropped') {
			playerIconMap.push(
				<CarriedBombIcon
					map={currentMap}
					rotation={Math.atan2(rotationArray[0], rotationArray[1])}
					position={posArray}
					key={posArray[0].toString() + player.steamId}
					beingObserved={observedPlayerID === player.steamId}
				/>,
			);
			continue;
		}

		let below = false;
		if (currentMap.heightCross) {
			below = posArray[2] < currentMap.heightCross;
		}

		playerIconMap.push(
			<PlayerIcon
				key={posArray[0].toString() + player.steamId}
				below={below}
				beingObserved={observedPlayerID === player.steamId}
				map={currentMap}
				position={posArray}
				observerId={player.observerSlot}
				rotation={Math.atan2(rotationArray[0], rotationArray[1])}
				ct={player.ct}
				steamId={player.steamId}
			/>,
		);
	}

	if (bomb?.state === 'dropped') {
		const bombPosArray = bomb.position.split(', ').map(Number);
		playerIconMap.push(<DroppedBombIcon position={bombPosArray} map={currentMap} key={'bomb'} />);
	} else if (bomb?.state === 'planted') {
		const bombPosArray = bomb.position.split(', ').map(Number);
		playerIconMap.push(<FlashingBomb position={bombPosArray} map={currentMap} key={'plantedBomb'} />);
	}

	// Reset grenade arrays on round reset
	useEffect(() => {
		if (mapPhase === 'freezetime' && !resetNades) {
			setResetNades(true);
			setFlashFragGrenades([]);
			setUsedFrags([]);
			setTempGrenades([]);
			setCurGrenades([]);
		}

		if (mapPhase === 'live' && resetNades) {
			setResetNades(false);
		}
	}, []);

	// FLASHBANGS & FRAG GRENADES
	useEffect(() => {
		tempGrenades.forEach((grenade) => {
			// If the flash no longer exists in world
			if (grenades[grenade.key] === undefined && grenade.type === 'flashbang') {
				const grenadeLocation = grenade.position.split(', ').map(Number);
				setFlashFragGrenades([
					...flashFragGrenades,
					<Grenade
						key={grenade.key}
						type="flashbang"
						style={{
							left: `${scaleTo100(grenadeLocation[0], currentMap.xMin, currentMap.xMax)}%`,
							bottom: `${scaleTo100(grenadeLocation[1], currentMap.yMin, currentMap.yMax)}%`,
						}}
					/>,
				]);

				const index = tempGrenades.indexOf(grenade);
				const grenadeList = tempGrenades.splice(index, 1);
				grenadeList.splice(index, 1);

				setTempGrenades(grenadeList);
			}

			// If HE nade has exploded (1.7 until explosion https://youtu.be/Cd80AYP59qE?t=216)
			if (
				grenade.type === 'frag' &&
				!usedFrags.includes(grenade.key) &&
				parseInt(grenades[grenade.key].lifetime, 10) >= 1.7
			) {
				const grenadeLocation = grenade.position.split(', ').map(Number);
				setFlashFragGrenades([
					...flashFragGrenades,
					<Grenade
						key={grenade.key}
						type="frag"
						style={{
							left: `${scaleTo100(grenadeLocation[0], currentMap.xMin, currentMap.xMax)}%`,
							bottom: `${scaleTo100(grenadeLocation[1], currentMap.yMin, currentMap.yMax)}%`,
						}}
					/>,
				]);

				const index = tempGrenades.indexOf(grenade);
				const grenadeList = tempGrenades;
				grenadeList.splice(index, 1);

				setTempGrenades(grenadeList);
				setUsedFrags([...usedFrags, grenade.key]);
			}
		});
	}, [
		currentMap.xMax,
		currentMap.xMin,
		currentMap.yMax,
		currentMap.yMin,
		flashFragGrenades,
		grenades,
		tempGrenades,
		usedFrags,
	]);

	// GRENADES
	useEffect(() => {
		const localGrenadeArray = [];
		for (const [key, grenade] of Object.entries(grenades)) {
			// FLASHBANG and FRAG
			if (grenade.type === 'frag' || grenade.type === 'flashbang') {
				const foundGrenade = tempGrenades.find((nade) => nade.key === key);
				if (foundGrenade) {
					// Update grenade position
					const index = tempGrenades.indexOf(foundGrenade);
					const grenadeArray = tempGrenades;
					foundGrenade.position = grenade.position;
					grenadeArray[index] = foundGrenade;
					setTempGrenades(grenadeArray);
				} else {
					// Add new temp
					setTempGrenades([...tempGrenades, { key, position: grenade.position, type: grenade.type }]);
				}

				continue;
			}

			const ct = Object.values(allPlayers).find((player) => player.steamId === grenade.owner)?.team === 'CT';
			let grenadeType = grenade.type;

			// Skip firebomb
			if (grenadeType === 'firebomb') {
				continue;
			}

			// MOLOTOV/INCENDIARY
			if (grenadeType === 'inferno') {
				grenadeType = 'fire';
				if (grenade.flames) {
					for (const [key, value] of Object.entries(grenade.flames)) {
						const fireLocation = value.split(', ').map(Number);
						localGrenadeArray.push(
							<Grenade
								ct={ct}
								type={grenadeType}
								key={key}
								style={{
									left: `${scaleTo100(fireLocation[0], currentMap.xMin, currentMap.xMax)}%`,
									bottom: `${scaleTo100(fireLocation[1], currentMap.yMin, currentMap.yMax)}%`,
								}}
							/>,
						);
					}

					continue;
				}
			}

			if (grenade.effecttime !== '0.0') {
				const grenadePosArray = grenade.position.split(', ').map(Number);
				// SMOKE and DECOY
				localGrenadeArray.push(
					<Grenade
						ct={ct}
						key={key}
						style={{
							left: `${scaleTo100(grenadePosArray[0], currentMap.xMin, currentMap.xMax)}%`,
							bottom: `${scaleTo100(grenadePosArray[1], currentMap.yMin, currentMap.yMax)}%`,
						}}
						type={grenadeType}
					/>,
				);
			}
		}

		if (!equal(curGrenades, localGrenadeArray)) {
			setCurGrenades(localGrenadeArray);
		}
	}, [
		curGrenades,
		currentMap.xMax,
		currentMap.xMin,
		currentMap.yMax,
		currentMap.yMin,
		allPlayers,
		grenades,
		tempGrenades,
	]);

	return (
		<MapContainer style={props.style} className={props.className}>
			<div style={{ width: 1024, height: 1024, border: '1px solid #fff' }}>
				<MapImage map={mapName as MapList} />
				<PlayerHolder>
					{playerIconMap}
					{curGrenades}
					{flashFragGrenades}
				</PlayerHolder>
			</div>
			{mapData && <SelectedMaps matchData={mapData} />}
		</MapContainer>
	);
};
