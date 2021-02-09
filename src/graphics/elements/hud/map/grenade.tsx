import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
	position: absolute;
`;

const ShowAnimation = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`;

const smokeSize = 100;
const Smoke = styled.div`
	transform: translate(-${smokeSize / 2}px, ${smokeSize / 2}px);
	animation: ${ShowAnimation} 1s;
	width: ${smokeSize}px;
	height: ${smokeSize}px;
	background: radial-gradient(
		circle,
		${(props: CTProps): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')} 7%,
		rgb(144, 144, 144) 11%,
		rgb(160, 160, 160) 40%,
		rgba(255, 255, 255, 0) 52%
	);
`;

const fireSize = 40;
const Fire = styled.div`
	animation: ${ShowAnimation} 1s;
	transform: translate(-${fireSize / 2}px, ${fireSize / 2}px);
	width: ${fireSize}px;
	height: ${fireSize}px;
	background: radial-gradient(
		circle,
		${(props: CTProps): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')} 17%,
		rgb(185, 111, 0) 22%,
		rgb(206, 166, 20) 40%,
		rgba(0, 0, 0, 0) 52%
	);
`;

const decoySize = 10;
const Decoy = styled.div`
	transform: translate(-${decoySize / 2}px, ${decoySize / 2}px);
	background: ${(props: CTProps): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	width: ${decoySize}px;
	height: ${decoySize}px;
	position: relative;
	text-align: center;

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: ${decoySize}px;
		width: ${decoySize}px;
		transform: translate(-${decoySize / 2}px, ${decoySize / 2}px);
		background: ${(props: CTProps): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	}
	&::before {
		transform: rotate(30deg);
	}
	&::after {
		transform: rotate(60deg);
	}
`;

const FlashAnimation = keyframes`
	0% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
`;

const flashSize = 100;
const Flash = styled.div`
	transform: translate(-${flashSize / 2}px, ${flashSize / 2}px);
	background: radial-gradient(circle, #fff 0%, #fff 20%, rgba(0, 0, 0, 0) 52%);
	animation: ${FlashAnimation} 2s;
	width: ${flashSize}px;
	height: ${flashSize}px;
	opacity: 0;
`;

const FragAnimation = keyframes`
	0% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
`;

const fragSize = 70;
const Frag = styled.div`
	transform: translate(-${fragSize / 2}px, ${fragSize / 2}px);
	background: radial-gradient(circle, #e4ed37 16%, #e88b35 40%, rgba(0, 0, 0, 0) 52%);
	animation: ${FragAnimation} 2s;
	width: ${fragSize}px;
	height: ${fragSize}px;
	opacity: 0;
`;

interface CTProps {
	ct?: boolean;
}

interface Props {
	type: string;
	ct?: boolean;
	style?: React.CSSProperties;
}

export const Grenade: React.FC<Props> = (props: Props) => {
	let grenadeType;

	switch (props.type) {
		case 'smoke':
			grenadeType = <Smoke ct={props.ct} />;
			break;

		case 'fire':
			grenadeType = <Fire ct={props.ct} />;
			break;

		case 'decoy':
			grenadeType = <Decoy ct={props.ct} />;
			break;

		case 'flashbang':
			grenadeType = <Flash />;
			break;

		case 'frag':
			grenadeType = <Frag />;
			break;

		default:
			grenadeType = props.type;
			break;
	}

	return <Container style={props.style}>{grenadeType}</Container>;
};
