/* eslint-disable camelcase */
import React from 'react';

export const primaryWeaponImages = {
	// Rifle
	ak47: require('../../images/in-game/weapons/ak47.svg'),
	aug: require('../../images/in-game/weapons/aug.svg'),
	awp: require('../../images/in-game/weapons/awp.svg'),
	famas: require('../../images/in-game/weapons/famas.svg'),
	g3sg1: require('../../images/in-game/weapons/g3sg1.svg'),
	galilar: require('../../images/in-game/weapons/galilar.svg'),
	m4a1_silencer: require('../../images/in-game/weapons/m4a1_silencer.svg'),
	m4a1: require('../../images/in-game/weapons/m4a1.svg'),
	scar20: require('../../images/in-game/weapons/scar20.svg'),
	sg556: require('../../images/in-game/weapons/sg556.svg'),
	ssg08: require('../../images/in-game/weapons/ssg08.svg'),

	// Heavy
	m249: require('../../images/in-game/weapons/m249.svg'),
	mag7: require('../../images/in-game/weapons/mag7.svg'),
	negev: require('../../images/in-game/weapons/negev.svg'),
	nova: require('../../images/in-game/weapons/nova.svg'),
	sawedoff: require('../../images/in-game/weapons/sawedoff.svg'),
	xm1014: require('../../images/in-game/weapons/xm1014.svg'),

	// SMG
	bizon: require('../../images/in-game/weapons/bizon.svg'),
	mac10: require('../../images/in-game/weapons/mac10.svg'),
	mp5sd: require('../../images/in-game/weapons/mp5sd.svg'),
	mp7: require('../../images/in-game/weapons/mp7.svg'),
	mp9: require('../../images/in-game/weapons/mp9.svg'),
	p90: require('../../images/in-game/weapons/p90.svg'),
	ump45: require('../../images/in-game/weapons/ump45.svg'),
};

interface Props {
	item: keyof typeof primaryWeaponImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type PrimaryWeaponList = keyof typeof primaryWeaponImages;

export const PrimaryWeapon: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			style={Object.assign(
				{
					transform: props.flip ? 'scaleX(-1)' : '',
					opacity: props.active ? '1' : '0.7',
				},
				props.style,
			)}
			src={primaryWeaponImages[props.item]}
		/>
	);
};
