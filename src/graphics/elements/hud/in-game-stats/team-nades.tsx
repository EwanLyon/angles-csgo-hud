import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { Grenades } from '../../atoms/grenades';
import { useSelector } from 'react-redux';
import { stateType } from '../../../replicant-store';

const Width = 300;

const Container = styled.div`
	position: relative;
	width: ${Width}px;
	height: 50px;
	color: #fff;
	display: flex;
	overflow: hidden;
	flex-direction: ${(props: StyleProps) => (props.right ? 'row-reverse' : 'row')};
`;

const Triangle = styled.div`
	width: 0;
	height: 0;
	border-top: 50px solid var(--bg-col);
	${(props: StyleProps) =>
		props.right ? 'border-left: 50px solid transparent' : 'border-right: 50px solid transparent'};
`;

const AllGrenades = styled.div`
	display: flex;
	align-items: center;
	flex-direction: ${(props: StyleProps) => (props.right ? 'row-reverse' : 'row')};
	justify-content: space-evenly;
	height: 100%;
	overflow: hidden;
	flex-wrap: nowrap;
	background: var(--bg-col);
	padding: 0 5px;

	& > * {
		margin: 0 6px;
	}
`;

const NadeHolder = styled.div`
	width: 50px;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
`;

const NadeImage = styled(Grenades)`
	height: 30px;
	width: auto;
`;

const NadeText = styled.span`
	display: block;
	font-family: Roboto;
	font-size: 25px;
	font-family: Roboto;
	line-height: 14px;
`;

interface StyleProps {
	ct?: boolean;
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

export const TeamNade: React.FC<Props> = (props: Props) => {
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
		<Container style={props.style} right={props.right} className={props.className} ref={containerRef}>
			<AllGrenades right={props.right}>
				<NadeHolder>
					<NadeImage item="hegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.he}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="flashbang" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.flash}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="smokegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.smoke}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item={props.ct ? 'incgrenade' : 'molotov'} />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.fire}
					</NadeText>
				</NadeHolder>
			</AllGrenades>
			<Triangle right={props.right} />
		</Container>
	);
};
