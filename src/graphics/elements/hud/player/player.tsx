import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

import { stateType } from '../../../replicant-store';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import * as Weapon from '../../atoms/weapons';
import { Armour } from '../../atoms/armour';
import { OtherIcons } from '../../atoms/other-icons';
import { HealthBar } from './health-bar';

const Container = styled.div`
	display: flex;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
	position: relative;
`;

const PlayerContainer = styled.div`
	width: 349px;
	height: 84px;

	${(props: ContainerProps): string => (props.right ? 'margin-left: 2px' : 'margin-right: 2px')};
`;

const ProfilePicture = styled.img`
	height: 84px;
	width: 84px;
`;

const PlayerName = styled(FitText)`
	justify-content: ${(props: PlayerNameProps): string => (props.right ? 'flex-end' : 'flex-start')} !important;

	color: ${(props: PlayerNameProps): string => (props.dead ? 'rgba(255, 255, 255, 0.7)' : '#FFF')};

	font-size: 22px;
	line-height: 30px;

	min-width: 150px;
	max-width: 150px;
	margin: 0 6px -7px 6px;

	& > ${FitTextText} {
		transform-origin: ${(props: PlayerNameProps): string => (props.right ? 'right' : 'left')};
	}
`;

const HealthText = styled.span`
	text-align: center;
	width: 37px;
	font-size: 21px;
	color: #ffffff;
	margin: 0 10px;
	font-weight: bold;
	z-index: 2;
`;

const HealthBarOverlay = styled.div`
	grid-column: 1;
	grid-row: 1;
	display: flex;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
	justify-content: space-between;
	align-items: center;
	width: 80%;
	${(props: OnRightProps): string => (props.right ? 'justify-self: end;' : '')}
`;

const MainWeapon = styled(Weapon.PrimaryWeapon)`
	height: 23px;
	padding: 0 10px;
	object-fit: scale-down;
	float: ${(props: MainWeaponsProps): string => (props.right ? 'left' : 'right')};
`;

const SecondaryWeapon = styled(Weapon.SecondaryWeapon)`
	height: 20px;
	width: auto;
	min-width: 52px;
	object-fit: scale-down;
	margin: 0 10px;
`;

const DataBar = styled.div`
	background: ${(props: StyleProps) =>
		props.observed
			? `linear-gradient(${props.right ? 270 : 90}deg, ${props.ct ? '#409ae3ba' : '#B89E5Cba'}, var(--bg-col))`
			: 'var(--bg-col)'};
	height: 54px;
	width: 218px;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: ${(props: StyleProps) => (props.right ? 'flex-end' : 'flex-start')};
	color: rgba(255, 255, 255, 1);
	font-size: 17px;
	line-height: 32px;
	padding: 0 5px;
	${(props: StyleProps) => (props.right ? 'float: right;' : '')}
	margin-top: -30px;
	padding-top: 30px;
`;

const DataBarTriangle = styled.div`
	width: 0;
	height: 0;
	border-top: 84px solid var(--bg-col);
	${(props: OnRightProps) =>
		props.right ? 'border-left: 84px solid transparent' : 'border-right: 84px solid transparent'};
	margin-top: -30px;
`;

const DataBars = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	flex-direction: ${(props: OnRightProps) => (props.right ? 'row-reverse' : 'row')};
	height: 20px;
	z-index: 2;
`;

const GrenadeBar = styled.div`
	display: flex;
	align-items: bottom;
	justify-content: flex-end;
	height: 20px;
	max-width: 90px;
	min-width: 90px;
`;

const Grenade = styled(Weapon.Grenades)`
	height: 100%;
	width: auto;
	margin: 0 4px;
	object-fit: contain;
`;

const ArmourBombDefuseSize = `
	height: auto;
	width: 16px;
	margin: 0 2px;
	object-fit: contain;
`;

const ArmourImg = styled(Armour)`
	${ArmourBombDefuseSize}
`;

const BombDefuseImg = styled(OtherIcons)`
	${ArmourBombDefuseSize}
`;

const EmptySpace = styled.div`
	${ArmourBombDefuseSize}
`;

const KillBoxes = styled.div`
	${(props: OnRightProps) => (props.right ? 'margin-right: -79px;' : 'margin-left: -79px;')}
	z-index: -1;
`;

const KillBox = styled.div`
	height: 84px;
	width: 10px;
	margin: 0 2px;
	background-color: ${(props: Combined): string => (props.ct ? 'var(--t-col)' : 'var(--ct-col)')};
	transform: ${(props: Combined): string => (props.right ? 'skew(45deg)' : 'skew(-45deg)')};
	display: inline-block;
`;

const SingleCell = styled.div`
	display: grid;
`;

const PlayerStats = styled.div`
	display: flex;
	align-items: center;
`;

const PlayerStat = styled.div`
	display: flex;
	align-items: center;
	margin-right: 10px;
`;

const PlayerStatIcon = styled.img`
	height: 60%;
	width: auto;
	margin-right: 5px;
`;

interface Props {
	right?: boolean;
	steamId: string;
}

interface PlayerNameProps extends BeingObserved {
	dead: boolean;
}

interface OnRightProps {
	right?: boolean;
}

interface BeingObserved extends OnRightProps {
	observed?: boolean;
}

interface Active {
	active?: boolean;
}

interface CTProps {
	ct?: boolean;
}

interface StyleProps {
	ct?: boolean;
	active?: boolean;
	observed?: boolean;
	right?: boolean;
}

interface Combined extends OnRightProps, CTProps {}

interface MainWeaponsProps extends Active, OnRightProps {}

interface ContainerProps extends BeingObserved, CTProps {}

export const Player: React.FC<Props> = (props: Props) => {
	const player = useSelector((state: stateType) => state.game.allplayers[props.steamId]);
	const playerData = useSelector((state: stateType) => state.playerData[props.steamId]);
	const obsPlayerId = useSelector((state: stateType) => state.observingPlayer.steamid);
	const bombId = useSelector((state: stateType) => state.bomb?.player);

	if (!player) return <></>;

	const observed = obsPlayerId === props.steamId;
	const carryingBomb = bombId === props.steamId;
	const isCT = player.team === 'CT';
	const helmetOrNormal = player.state.helmet ? 'helmet' : 'normal';

	const weapons = Object.values(player.weapons);
	const grenades = weapons.map((weapon) => {
		if (weapon.type === 'Grenade') {
			return weapon;
		}

		return undefined;
	});
	const grenadeList = grenades.map((grenade, index) => {
		if (grenade) {
			return (
				<Grenade
					item={grenade.name.replace('weapon_', '') as Weapon.GrenadeList}
					active={grenade.state === 'active'}
					key={index}
				/>
			);
		}

		return undefined;
	});

	const primaryWeapon = weapons.find((weapon) => {
		switch (weapon.type) {
			case 'C4':
			case 'Grenade':
			case 'Knife':
			case 'Pistol':
				return undefined;

			default:
				return weapon;
		}
	});

	const secondaryWeapon = weapons.find((weapon) => {
		switch (weapon.type) {
			case 'Pistol':
				return weapon;

			default:
				return undefined;
		}
	});

	const KillBoxList = [];
	for (let i = 0; i < player.state.round_kills; i++) {
		KillBoxList.push(<KillBox ct={isCT} right={props.right} key={i} />);
	}

	const dead = player.state.health <= 0;

	useEffect(() => {
		if (dead) {
			const tl = gsap.timeline();

			tl.addLabel('start');

			tl.to(`#killboxes-${props.steamId}`, { x: props.right ? 118 : -118, duration: 0.5 }, 'start');
			tl.to(`#databar-${props.steamId}`, { width: 100, duration: 0.5 }, 'start');
		} else {
			const tl = gsap.timeline();

			tl.set(`#killboxes-${props.steamId}`, { x: 0 });
			tl.set(`#databar-${props.steamId}`, { width: 218 });
		}
	}, [dead]);

	return (
		<Container right={props.right}>
			<ProfilePicture
				src={
					playerData?.image ||
					'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'
				}
			/>
			<PlayerContainer right={props.right} ct={isCT}>
				<SingleCell style={{ width: 360, float: props.right ? 'right' : 'initial' }}>
					<div
						style={{
							gridColumn: 1,
							gridRow: 1,
							position: 'relative',
						}}>
						{dead ? (
							<div style={{ height: 30 }} />
						) : (
							<HealthBar right={props.right} progress={dead ? -100 : player.state.health} isCT={isCT} />
						)}
					</div>
					<HealthBarOverlay right={props.right}>
						<PlayerName right={props.right} text={player.name} dead={dead} />
						{!dead && (
							<div
								style={{
									zIndex: 2,
									display: 'flex',
									flexDirection: props.right ? 'row-reverse' : 'row',
								}}>
								{player.state.armor ? <ArmourImg item={helmetOrNormal} /> : ''}
								<HealthText>{player.state.health}</HealthText>
							</div>
						)}
					</HealthBarOverlay>
				</SingleCell>

				<div style={{ display: 'flex', flexDirection: props.right ? 'row-reverse' : 'row', width: '100%' }}>
					<DataBar right={props.right} ct={isCT} observed={observed} id={`databar-${props.steamId}`}>
						<DataBars right={props.right} style={{ width: '118%' }}>
							<div
								style={{
									minWidth: 72,
									textAlign: props.right ? 'right' : 'left',
								}}>
								<span style={{ fontSize: 15 }}>$</span>
								{player.state.money}
							</div>

							{secondaryWeapon && (
								<SecondaryWeapon
									active={secondaryWeapon.state === 'active'}
									flip={props.right}
									item={secondaryWeapon.name.replace('weapon_', '') as Weapon.SecondaryWeaponList}
								/>
							)}
							{primaryWeapon ? (
								<div style={{ width: 142 }}>
									<MainWeapon
										active={primaryWeapon.state === 'active'}
										flip={props.right}
										right={props.right}
										item={primaryWeapon.name.replace('weapon_', '') as Weapon.PrimaryWeaponList}
									/>
								</div>
							) : (
								<div style={{ width: 142 }}></div>
							)}
						</DataBars>
						<DataBars right={props.right} style={{ justifyContent: 'space-between' }}>
							<PlayerStats>
								<PlayerStat>
									<PlayerStatIcon src={require('../../../images/in-game/kill.svg')} />
									<span style={{marginBottom: -4}}>{player.match_stats.kills}</span>
								</PlayerStat>
								<PlayerStat>
									<PlayerStatIcon src={require('../../../images/in-game/skull.svg')} />
									<span style={{marginBottom: -4}}>{player.match_stats.deaths}</span>
								</PlayerStat>
							</PlayerStats>
							<div style={{ display: 'flex', justifyContent: 'center', minWidth: 50 }}>
								{isCT ? (
									player.state.defusekit ? (
										<BombDefuseImg item="defuse" />
									) : (
										<EmptySpace />
									)
								) : (
									carryingBomb && <BombDefuseImg item="bomb" />
								)}
								<GrenadeBar>{grenadeList}</GrenadeBar>
							</div>
						</DataBars>
					</DataBar>
					<DataBarTriangle right={props.right} id={`data-triangle-${props.steamId}`} />
				</div>
			</PlayerContainer>
			<KillBoxes right={props.right} id={`killboxes-${props.steamId}`}>
				{KillBoxList}
			</KillBoxes>
		</Container>
	);
};

Player.displayName = 'Player';
