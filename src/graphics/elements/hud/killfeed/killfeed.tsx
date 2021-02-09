import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';

import { PlayerDeath } from '../../../../types/hlae';
import { stateType } from '../../../replicant-store';

import { Kill } from './kill';

const KillfeedContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;

	& > * {
		margin-top: 8px;
	}
`;

export const Killfeed: React.FC = () => {
	// Const matchKills = useSelector((state: stateType) => state.matchKills);
	const [currentKills, setCurrentKills] = useState<PlayerDeath[]>([]);
	const round = useSelector((state: stateType) => state.matchStats.round);
	useListenFor(
		'hlae:playerDeath',
		(data: PlayerDeath) => {
			setCurrentKills([...currentKills, data]);
		},
		{ bundle: 'nodecg-csgo-manager' },
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentKills([]);
		}, 7000);
		return () => clearTimeout(timer);
	}, [round]);

	// Console.log(matchKills);

	return (
		<KillfeedContainer>
			{currentKills.map((kill, i) => {
				return <Kill data={kill} key={i} />;
			})}
		</KillfeedContainer>
	);
};
