import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';

import { PlayerDeath } from '../../../../types/hlae';
import { stateType } from '../../../replicant-store';
import { KillIcon } from './kill-icon';

const KillContainer = styled.div`
	height: 0;
	display: flex;
	overflow: hidden;
`;

const Info = styled.div`
	height: 100%;
	font-size: 18px;
	background: var(--bg-col);
	display: flex;
	align-items: center;
	min-width: fit-content;
	width: fit-content;
	/* margin-top: 8px; */
	padding-right: 25px;
`;

const Triangle = styled.div`
	width: 0;
	height: 0;
	border-top: 34px solid var(--bg-col);
	border-left: 34px solid transparent;
	/* margin-top: 8px; */
`;

const InfoIcon = styled.img`
	margin: 0 4px;
	height: 80%;
	width: auto;
`;

const PlayerName = styled.span`
	margin: 0 8px -5px 8px;
	color: ${(props: StyleProps) => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	font-weight: 600;
	white-space: nowrap;
`;

interface StyleProps {
	ct?: boolean;
}

interface Props {
	data: PlayerDeath;
}

export const Kill: React.FC<Props> = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const infoRef = useRef<HTMLDivElement>(null);
	const playerDead = useSelector((state: stateType) => state.game.allplayers[props.data.keys.userid.xuid]);
	const attacker = useSelector((state: stateType) => state.game.allplayers[props.data.keys.attacker.xuid]);
	const assister = useSelector((state: stateType) => state.game.allplayers[props.data.keys.assister.xuid]);

	useEffect(() => {
		const tl = gsap.timeline();

		tl.set(containerRef.current, { height: 0, x: 254 });
		tl.set(infoRef.current, {paddingRight: 0});
		tl.addLabel('Open');

		tl.to(containerRef.current, { height: 34, x: 0, duration: 0.1 }, 'Open');
		tl.to(infoRef.current, { paddingRight: 25, duration: 0.1 }, 'Open');
		// tl.to(containerRef.current, { height: 0, x: 254, opacity: 0, duration: 0.3 }, '+=5');
	}, []);

	return (
		<KillContainer ref={containerRef}>
			<Triangle />
			<Info ref={infoRef}>
				{props.data.keys.attackerblind && (
					<InfoIcon src={require('../../../images/in-game/weapons/blind_kill.svg')} />
				)}
				<PlayerName ct={(attacker?.team || 'CT') === 'CT'}>{attacker?.name || 'Test'} </PlayerName>
				{assister && (
					<>
						<span style={{ color: '#ffffff' }}>+</span>
						{props.data.keys.assistedflash && (
							<InfoIcon src={require('../../../images/in-game/grenades/flashbang.svg')} />
						)}
						<PlayerName ct={(assister?.team || 'CT') === 'CT'}>{assister?.name || 'Test'} </PlayerName>
					</>
				)}
				<KillIcon weapon={props.data.keys.weapon} />
				{props.data.keys.noscope && <InfoIcon src={require('../../../images/in-game/weapons/noscope.svg')} />}
				{props.data.keys.thrusmoke && (
					<InfoIcon src={require('../../../images/in-game/weapons/smoke_kill.svg')} />
				)}
				{Boolean(props.data.keys.penetrated) && (
					<InfoIcon src={require('../../../images/in-game/weapons/penetrate.svg')} />
				)}
				{props.data.keys.headshot && (
					<InfoIcon src={require('../../../images/in-game/weapons/icon_headshot.svg')} />
				)}
				<PlayerName ct={playerDead?.team === 'CT'}>{playerDead?.name || 'Test'} </PlayerName>
			</Info>
		</KillContainer>
	);
};
