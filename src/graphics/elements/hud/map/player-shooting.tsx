import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';
import { WeaponFire } from '../../../../types/hlae';
import { stateType } from '../../../replicant-store';
import { MapData } from './map-data';

const PlayerShootingContainer = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
`;

function scaleTo100(num: number, inMin: number, inMax: number): number {
	return ((num - inMin) * 100) / (inMax - inMin);
}

export const PlayerShooting: React.FC = () => {
	const currentMap = useSelector((state: stateType) => state.matchStats.name);
	const [currentFirings, setCurrentFirings] = useState<JSX.Element[]>([]);
	const mapData = MapData[currentMap];

	function removeWeaponFire(id: string) {
		const index = currentFirings.findIndex((el) => el.key === id);
		const newFirings = currentFirings.splice(index, 1);
		setCurrentFirings(newFirings);
	}

	useListenFor(
		'hlae-weaponFire',
		(gameEvent: WeaponFire) => {
			setCurrentFirings([
				...currentFirings,
				<FiringLine
					key={Date.now().toString()}
					id={Date.now().toString()}
					style={{
						left: `${scaleTo100(gameEvent.keys.userid.eyeOrigin[0], mapData.xMin, mapData.xMax)}%`,
						bottom: `${scaleTo100(gameEvent.keys.userid.eyeOrigin[1], mapData.yMin, mapData.yMax)}%`,
						// transform: `rotate(${Math.atan2(
						// 	gameEvent.keys.userid.eyeAngles[0],
						// 	gameEvent.keys.userid.eyeAngles[1],
						// )}rad)`,
						transform: `rotate(${gameEvent.keys.userid.eyeAngles[1]}deg)`,
					}}
					removeFunc={removeWeaponFire}
				/>,
			]);
		},
		{ bundle: 'nodecg-csgo-manager' },
	);
	return <PlayerShootingContainer>{currentFirings}</PlayerShootingContainer>;
};

const ShootingContainer = styled.div`
	width: 2px;
	background: #fff;
	height: 130px;
	position: absolute;
`;

interface ShootingProps {
	id: string;
	removeFunc: (id: string) => void;
	style?: React.CSSProperties;
}

const FiringLine: React.FC<ShootingProps> = (props: ShootingProps) => {
	// useEffect(() => {
	// 	const timeout = setTimeout(() => {
	// 		props.removeFunc(props.id);
	// 	}, 1000);
	// 	return () => clearTimeout(timeout);
	// }, []);

	return <ShootingContainer style={props.style} />;
};

// {
//     "name": "weapon_fire",
//     "clientTime": 36.703125,
//     "keys": {
//         "userid": {
//             "value": 7,
//             "xuid": "76561198132024641",
//             "eyeOrigin": [
//                 -12100.3212890625,
//                 859.1365356445312,
//                 3648.03125
//             ],
//             "eyeAngles": [
//                 2.0355420112609863,
//                 56.09529495239258,
//                 -0.00003102223126916215
//             ]
//         },
//         "weapon": "weapon_glock",
//         "silenced": false
//     },
//     "round": 0
// }
