import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useListenFor } from 'use-nodecg';
import { WeaponFire } from '../../../../types/hlae';

import { MapRadarData } from './map-data';

const playerIconWidth = 30;
const ContainerPlayerIcon = styled.div`
	position: absolute;
	width: ${playerIconWidth}px;
	height: ${playerIconWidth}px;
	transform: translate(-${playerIconWidth / 2}px, ${playerIconWidth / 2}px);
	border-radius: ${playerIconWidth}px;
	background: ${(props: PlayerIconStyle) => (props.ct ? '#0C7BC0' : 'var(--t-col)')};
	opacity: ${(props: PlayerIconStyle) => (props.below ? 0.7 : 1)};
	z-index: ${(props: PlayerIconStyle) => (props.observed ? 2 : 1)};
	text-align: center;
	line-height: 34px;
	color: white;
	font-weight: 500;
	font-size: 25px;
	box-shadow: 0 0 0 ${(props: PlayerIconStyle) => (props.observed ? '5' : '0')}px white;
`;

const FacingArrow = styled.div`
	margin: auto;
	margin-top: -49px;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;

	border-bottom: 15px solid white;
	transform-origin: 50% 200%;
`;

const bombWidth = 40;
const BombImage = styled.div`
	background-image: url(${(props: PlayerIconStyle) => props.observed ? require('../../../images/in-game/elements/c4_timer_noflash_sq.png') : require('../../../images/in-game/elements/c4_timer_noflash_col_sq.png')});
	background-size: cover;
	position: absolute;
	height: ${bombWidth}px;
	width: ${bombWidth}px;
	transform: translate(-${bombWidth / 2}px, ${bombWidth / 2}px);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const deadPlayerSize = 30;
const DeadPlayerStyle = styled.div`
	position: absolute;
	color: ${(props: PlayerIconStyle) => (props.ct ? '#0C7BC0' : 'var(--t-col)')};
	font-weight: bold;
	font-size: 40px;
	width: ${deadPlayerSize}px;
	height: ${deadPlayerSize}px;
	transform: translate(-${deadPlayerSize / 2}px, ${deadPlayerSize / 2}px);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const BombFlashing = keyframes`
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.2;
	}
	100% {
		opacity: 1;
	}
`;

const FlashingBombStyle = styled(BombImage)`
	animation: ${BombFlashing} 1s infinite;
`;

const FiringLine = styled.div`
	width: 2px;
	background: #fff;
	height: 130px;
	position: absolute;
	margin-top: -133px;
	margin-left: -1px;
	opacity: 0;
`;

interface Props {
	position: number[];
	rotation: number;
	map: MapRadarData;
	ct?: boolean;
	below?: boolean;
	beingObserved?: boolean;
	observerId: number;
	steamId: string;
}

interface PlayerIconStyle {
	ct?: boolean;
	below?: boolean;
	observed?: boolean;
}

function scaleTo100(num: number, inMin: number, inMax: number): number {
	return ((num - inMin) * 100) / (inMax - inMin);
}

export const PlayerIcon: React.FC<Props> = (props: Props) => {
	const firingLineRef = useRef<HTMLDivElement>(null);

	useListenFor(
		'hlae:weaponFire',
		(gameEvent: WeaponFire) => {
			if (
				gameEvent.keys.userid.xuid === props.steamId &&
				!disallowedFiringWeapons.includes(gameEvent.keys.weapon)
			) {
				firingLineRef.current?.classList.remove('firing-animation');
				void firingLineRef.current?.offsetWidth;
				firingLineRef.current?.classList.add('firing-animation');
			}
		},
		{ bundle: 'nodecg-csgo-manager' },
	);

	return (
		<ContainerPlayerIcon
			below={props.below}
			ct={props.ct}
			style={{
				left: `${scaleTo100(props.position[0], props.map.xMin, props.map.xMax)}%`,
				bottom: `${scaleTo100(props.position[1], props.map.yMin, props.map.yMax)}%`,
			}}
			observed={props.beingObserved}>
			{props.observerId === 10 ? '0' : props.observerId}
			<FacingArrow
				style={{
					transform: `rotate(${props.rotation}rad)`,
				}}>
				<FiringLine ref={firingLineRef} />
			</FacingArrow>
		</ContainerPlayerIcon>
	);
};

interface BombProps {
	position: number[];
	rotation: number;
	map: MapRadarData;
	beingObserved?: boolean;
}

export const CarriedBombIcon: React.FC<BombProps> = (props: BombProps) => {
	return (
		<BombImage
			observed={props.beingObserved}
			style={{
				left: `${scaleTo100(props.position[0], props.map.xMin, props.map.xMax)}%`,
				bottom: `${scaleTo100(props.position[1], props.map.yMin, props.map.yMax)}%`,
			}}>
			<FacingArrow
				style={{
					transform: `rotate(${props.rotation}rad)`,
					marginTop: '-10px',
				}}
			/>
		</BombImage>
	);
};

interface DroppedBombProps {
	position: number[];
	map: MapRadarData;
}

export const DroppedBombIcon: React.FC<DroppedBombProps> = (props: DroppedBombProps) => {
	return (
		<BombImage
			style={{
				opacity: 0.7,
				left: `${scaleTo100(props.position[0], props.map.xMin, props.map.xMax)}%`,
				bottom: `${scaleTo100(props.position[1], props.map.yMin, props.map.yMax)}%`,
			}}
		/>
	);
};

interface DeadPlayerProps {
	position: number[];
	ct?: boolean;
	map: MapRadarData;
}

export const DeadPlayer: React.FC<DeadPlayerProps> = (props: DeadPlayerProps) => {
	return (
		<DeadPlayerStyle
			ct={props.ct}
			style={{
				left: `${scaleTo100(props.position[0], props.map.xMin, props.map.xMax)}%`,
				bottom: `${scaleTo100(props.position[1], props.map.yMin, props.map.yMax)}%`,
			}}>
			X
		</DeadPlayerStyle>
	);
};

interface FlashingBombProps {
	position: number[];
	map: MapRadarData;
}

export const FlashingBomb: React.FC<FlashingBombProps> = (props: FlashingBombProps) => {
	return (
		<FlashingBombStyle
			style={{
				left: `${scaleTo100(props.position[0], props.map.xMin, props.map.xMax)}%`,
				bottom: `${scaleTo100(props.position[1], props.map.yMin, props.map.yMax)}%`,
			}}
		/>
	);
};

const disallowedFiringWeapons = ['weapon_knife'];
