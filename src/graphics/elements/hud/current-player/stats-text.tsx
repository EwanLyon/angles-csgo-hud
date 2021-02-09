import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fff;
`;

const Title = styled.span`
	font-weight: 300;
	font-size: 15px;
	margin-top: 3px;
`;

const Stat = styled.span`
	font-size: 20px;
	font-family: roboto;
`;

interface Props {
	text: string;
	stat: number;
}

export const StatsText: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<Container>
			<Title>{props.text}</Title>
			<Stat>{props.stat}</Stat>
		</Container>
	);
};
