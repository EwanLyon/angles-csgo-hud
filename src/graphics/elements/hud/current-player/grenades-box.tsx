import React from 'react';
import styled from 'styled-components';

import { Grenades, GrenadeList } from '../../atoms/grenades';

const Container = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
	padding: 0 15px;
`;

const GrenadeImg = styled(Grenades)`
	height: 45%;
	width: auto;
	margin: 0 4px;
`;

interface Props {
	style?: React.CSSProperties;
	className?: string;
	grenades?: GrenadeList[];
}

export const GrenadesBox: React.FunctionComponent<Props> = (props: Props) => {
	if (!props.grenades?.length) return <></>;

	const grenadesDisplay = props.grenades
		? props.grenades.map((grenade, index) => <GrenadeImg item={grenade} key={index} />)
		: '';

	return <Container className={props.className} style={props.style}>{grenadesDisplay}</Container>;
};
