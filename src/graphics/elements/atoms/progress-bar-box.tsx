import React, { ReactNode } from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: ${(props: ProgressBarContainerProps): string =>
		props.right ? 'flex-end' : 'flex-start'};
`;

interface ProgressBarContainerProps {
	right?: boolean;
}

interface Props {
	progress: number;
	fillColor?: string;
	right?: boolean;
	progressBarStyle: React.CSSProperties;
	className?: string;
	children?: ReactNode;
	childrenStyle?: React.CSSProperties;
	style?: React.CSSProperties;
}

export const ProgressBarBox: React.FunctionComponent<Props> = (props: Props) => {
	const progress = Math.min(props.progress, 100);

	const progressBatStyle: React.CSSProperties = {
		...props.progressBarStyle,
		position: 'absolute',
		width: `${progress}%`,
		height: '100%',
	};

	const childrenStyle: React.CSSProperties = {
		...props.childrenStyle,
		position: 'absolute',
		width: '100%',
		height: '100%',
	};

	return (
		<ProgressBarContainer className={props.className} right={props.right} style={props.style}>
			<div style={progressBatStyle}></div>
			<div style={childrenStyle}>{props.children}</div>
		</ProgressBarContainer>
	);
};
