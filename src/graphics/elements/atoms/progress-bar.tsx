import React, { ReactNode } from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div.attrs((props: Props) => ({
	style: {
		background: `linear-gradient(
		to ${props.right ? 'left' : 'right'},
		${props.color}
			${props.progress}%,
		${props.fillColor || 'rgba(0, 0, 0, 0)'}
			${props.progress}%
	)`,
	},
}))``;

interface Props {
	progress: number;
	color: string;
	fillColor?: string;
	right?: boolean;
	children?: ReactNode;
	className?: string;
}

export const ProgressBar: React.FunctionComponent<Props> = (props: Props) => {
	const progress = props.progress >= 100 ? 100 : props.progress;

	return (
		<ProgressBarContainer
			progress={progress}
			color={props.color}
			right={props.right}
			className={props.className}
			fillColor={props.fillColor}>
			{props.children}
		</ProgressBarContainer>
	);
};
