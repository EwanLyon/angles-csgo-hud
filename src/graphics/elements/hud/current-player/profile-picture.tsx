import React from 'react';
import styled from 'styled-components';
import Twemoji from 'react-twemoji';

const Container = styled.div`
	position: relative;
	margin-bottom: -5px;
`;

const ProfileImg = styled.img`
	width: 137px;
	height: auto;
	border: 1px solid white;
`;

const CountryFlag = styled.span`
	position: absolute;
	right: 5px;
	bottom: 5px;
	height: 35px;
	width: 35px;
`;

interface Props {
	url: string;
	country?: string;
}

export const ProfilePicture: React.FunctionComponent<Props> = (props: Props) => {
	if (props.url === '') {
		return <React.Fragment></React.Fragment>;
	}

	return (
		<Container>
			<ProfileImg src={props.url} />
			<Twemoji options={{ folder: 'svg', ext: '.svg' }}>
				<CountryFlag>{props.country}</CountryFlag>
			</Twemoji>
		</Container>
	);
};
