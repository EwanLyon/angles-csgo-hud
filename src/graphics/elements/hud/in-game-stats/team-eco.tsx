import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { stateType } from '../../../replicant-store';

const Width = 360;

const Container = styled.div`
	position: relative;
	width: ${Width}px;
	height: 56px;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	flex-direction: ${(props: StyleProps) => (props.right ? 'row-reverse' : 'row')};
`;

const AllData = styled.div`
	display: flex;
	align-items: center;
	flex-direction: ${(props: StyleProps) => (props.right ? 'row-reverse' : 'row')};
	justify-content: space-between;
	height: 100%;
	width: 100%;
	/* overflow: hidden; */
	flex-wrap: nowrap;
	background: var(--bg-col);

	& > * {
		margin: 0 6px;
	}
`;

const Triangle = styled.div`
	width: 0;
	height: 0;
	border-top: 56px solid var(--bg-col);
	${(props: StyleProps) =>
		props.right ? 'border-left: 56px solid transparent' : 'border-right: 56px solid transparent'};
`;

const TitleText = styled.span`
	color: #ddd;
	font-size: 13px;
	white-space: nowrap;
`;

const MoneyText = styled.span`
	display: block;
	font-size: 20px;
`;

const LossContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	height: 100%;
`;

// So the flex spacing has an offset for the loss container
// const EmptyContainer = styled.div`
// 	width: 3px;
// `;

const LossBonusBox = styled.div`
	width: 15px;
	height: 8px;
	background: ${(props: StyleProps): string =>
		props.active ? (props.ct ? 'var(--ct-col)' : 'var(--t-col)') : 'var(--bg-col)'};
`;

interface StyleProps {
	ct?: boolean;
	active?: boolean;
	right?: boolean;
}

interface Props {
	ct?: boolean;
	right?: boolean;
	style?: React.CSSProperties;
	className?: string;
	show?: boolean;
	teamTwo?: boolean;
}

export const TeamEco: React.FC<Props> = (props: Props) => {
	const teamData = useSelector((state: stateType) => (props.teamTwo ? state.teamTwo : state.teamOne));
	const tl = useRef<gsap.core.Timeline>();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		tl.current = gsap.timeline({ paused: true });

		tl.current.addLabel('Show');

		tl.current.set(containerRef.current, {
			opacity: 0,
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
		});
		tl.current.to(containerRef.current, { opacity: 1, duration: 0.5 });
		tl.current.to(containerRef.current, {
			ease: 'expo.out',
			width: Width,
			duration: 1,
		});

		tl.current.addPause('+=0.1');

		tl.current.addLabel('Hide');

		tl.current.set(containerRef.current, {
			opacity: 1,
			width: Width,
		});
		tl.current.to(containerRef.current, {
			ease: 'expo.out',
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
			duration: 1,
		});
		tl.current.to(containerRef.current, { opacity: 0, duration: 0.5 });
	}, []);

	const goToAnimation = (stage: string): void => {
		if (tl.current) {
			const labelTime = tl.current.labels[stage];
			tl.current.play(labelTime);
		}
	};

	useEffect(() => {
		if (props.show) {
			goToAnimation('Show');
		} else {
			goToAnimation('Hide');
		}
	}, [props.show]);

	return (
		<Container right={props.right} style={props.style} className={props.className} ref={containerRef}>
			<AllData right={props.right}>
				<LossContainer>
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 4} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 3} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 2} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 1} ct={props.ct} />
				</LossContainer>
				<div style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Loss Bonus</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{Math.max(teamData.consecutiveRoundLosses * 500 + 1400)}
					</MoneyText>
				</div>
				<div style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Team Money</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{teamData.totalMoney}
					</MoneyText>
				</div>
				<div style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Equipment Value</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{teamData.equipmentValue}
					</MoneyText>
				</div>
			</AllData>
			<Triangle right={props.right} />
		</Container>
	);
};
