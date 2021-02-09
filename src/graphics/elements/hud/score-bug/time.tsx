import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import { CSGOPhaseCountdowns } from '../../../../types/csgo-gsi';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const TimeText = styled(Text)`
	font-size: 54px;
	font-weight: bold;
	max-width: 115px;
	min-height: 44px;
	font-family: Roboto;
	align-items: center;
`;

const NormalText = styled(TimeText)`
	font-size: 30px;
	line-height: 44px;
`;

const TWinText = styled(NormalText)`
	color: var(--t-col);
`;

const CTWinText = styled(NormalText)`
	color: var(--ct-col);
`;

const TTimeOut = styled(TWinText)`
	text-shadow: none;
`;

const CTTimeOut = styled(CTWinText)`
	text-shadow: none;
`;

const PausedText = styled(NormalText)`
	font-size: 25px;
	color: #cecece;
	text-shadow: none;
	text-transform: uppercase;
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

const BombImage = styled.img`
	height: 43px;
	width: 50px;
	animation: ${BombFlashing} 1s infinite;
`;

interface Props {
	phase: CSGOPhaseCountdowns['phase'];
	time: number;
	roundWin?: string;
}

const greyTimeConditions = ['freezetime', 'timeout_t', 'timeout_ct'];

function padZero(num: number): string {
	return Array(Math.max(2 - String(num).length + 1, 0)).join('0') + num;
}

export const Time: React.FC<Props> = React.memo((props: Props) => {
	let timerObj = <></>;
	let minutes = 0;
	let seconds = 0;

	switch (props.phase) {
		case 'live':
		case 'freezetime':
		case 'timeout_ct':
		case 'timeout_t':
			minutes = ~~(props.time / 60);
			seconds = Math.ceil(props.time - minutes * 60);

			if (seconds === 60) {
				minutes = 1;
				seconds = 0;
			}

			break;

		default:
			break;
	}

	// Should change this to a switch case
	if (props.phase === 'bomb' || props.phase === 'defuse') {
		timerObj = <BombImage src={require('../../../images/in-game/elements/c4_timer.png')} />;
	} else if (props.phase === 'timeout_t') {
		timerObj = <TTimeOut text={`${minutes}:${padZero(seconds)}`} />;
	} else if (props.phase === 'timeout_ct') {
		timerObj = <CTTimeOut text={`${minutes}:${padZero(seconds)}`} />;
	} else if (greyTimeConditions.includes(props.phase)) {
		timerObj = <TimeText style={{ color: '#cecece' }} text={`${minutes}:${padZero(seconds)}`} />;
	} else if (props.roundWin) {
		if (props.roundWin === 'T') {
			timerObj = <TWinText text="T WIN" />;
		} else {
			timerObj = <CTWinText text="CT WIN" />;
		}
	} else if (props.phase === 'paused' || props.phase === 'warmup') {
		timerObj = <PausedText text={props.phase} />;
	} else {
		timerObj = <TimeText text={`${minutes}:${padZero(seconds)}`} />;
	}

	return timerObj
});

Time.displayName = 'ScoreBugTime';
