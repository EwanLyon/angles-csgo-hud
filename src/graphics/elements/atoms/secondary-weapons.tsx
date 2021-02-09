/* eslint-disable camelcase */
import React from 'react';

export const secondaryWeaponImages = {
	cz75a: require('../../images/in-game/weapons/cz75a.svg'),
	deagle: require('../../images/in-game/weapons/deagle.svg'),
	elite: require('../../images/in-game/weapons/elite.svg'),
	fiveseven: require('../../images/in-game/weapons/fiveseven.svg'),
	glock: require('../../images/in-game/weapons/glock.svg'),
	hkp2000: require('../../images/in-game/weapons/hkp2000.svg'),
	p250: require('../../images/in-game/weapons/p250.svg'),
	revolver: require('../../images/in-game/weapons/revolver.svg'),
	tec9: require('../../images/in-game/weapons/tec9.svg'),
	usp_silencer: require('../../images/in-game/weapons/usp_silencer.svg'),
};

interface Props {
	item: keyof typeof secondaryWeaponImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type SecondaryWeaponList = keyof typeof secondaryWeaponImages;

export const SecondaryWeapon: React.FunctionComponent<Props> = (props: Props) => {
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
			src={secondaryWeaponImages[props.item]}
		/>
	);
};
