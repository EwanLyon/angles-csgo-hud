import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
	height: 30px;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: ${(props: ProgressBarContainerProps): string => (props.right ? 'flex-end' : 'flex-start')};
	overflow: hidden;
`;

const HealthBarDynamic = styled.div`
	background: ${(props: ProgressBarContainerProps) => (props.isCT ? 'var(--ct-col)' : 'var(--t-col)')};
	box-sizing: border-box;
	position: absolute;
	height: 100%;
`;

const HealthBarTriangle = styled.div`
	width: 0;
	height: 0;
	border-top: 30px solid ${(props: ProgressBarContainerProps) => (props.isCT ? 'var(--ct-col)' : 'var(--t-col)')};
	${(props: ProgressBarContainerProps) =>
		props.right ? 'border-left: 30px solid transparent' : 'border-right: 30px solid transparent'};
	${(props: ProgressBarContainerProps) => (props.right ? 'left: -30px' : 'right: -30px')};
`;

interface ProgressBarContainerProps {
	right?: boolean;
	isCT?: boolean;
	width?: number;
}

interface Props {
	progress: number;
	right?: boolean;
	className?: string;
	isCT?: boolean;
}

export const HealthBar: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const progress = Math.min(props.progress, 100);
	const correctedProgress = progress - 8.3; // Account for triangle added

	const healthBarStyle: React.CSSProperties = {
		width: `${correctedProgress}%`
	}

	const triangleOffset: React.CSSProperties = {
		marginLeft: props.right ? 0 : `${correctedProgress}%`,
		marginRight: props.right ? `${correctedProgress}%` : 0,
	};

	return (
		<ProgressBarContainer className={props.className} right={props.right} isCT={props.isCT}>
			<HealthBarDynamic style={healthBarStyle} isCT={props.isCT} />
			<HealthBarTriangle style={triangleOffset} right={props.right} isCT={props.isCT} />
		</ProgressBarContainer>
	);
});
