/* eslint-disable camelcase */
import React from 'react';

export const knifeImages = {
	knife: require('../../images/in-game/weapons/knife.svg'),
	knife_bowie: require('../../images/in-game/weapons/knife_bowie.svg'),
	knife_butterfly: require('../../images/in-game/weapons/knife_butterfly.svg'),
	knife_canis: require('../../images/in-game/weapons/knife_canis.svg'),
	knife_cord: require('../../images/in-game/weapons/knife_cord.svg'),
	knife_css: require('../../images/in-game/weapons/knife_css.svg'),
	knife_falchion: require('../../images/in-game/weapons/knife_falchion.svg'),
	knife_flip: require('../../images/in-game/weapons/knife_flip.svg'),
	knife_gut: require('../../images/in-game/weapons/knife_gut.svg'),
	knife_gypsy_jackknife: require('../../images/in-game/weapons/knife_gypsy_jackknife.svg'),
	knife_karambit: require('../../images/in-game/weapons/knife_karambit.svg'),
	knife_m9_bayonet: require('../../images/in-game/weapons/knife_m9_bayonet.svg'),
	knife_outdoor: require('../../images/in-game/weapons/knife_outdoor.svg'),
	knife_shadow_dagger: require('../../images/in-game/weapons/knife_shadow_dagger.svg'),
	knife_skeleton: require('../../images/in-game/weapons/knife_skeleton.svg'),
	knife_stiletto: require('../../images/in-game/weapons/knife_stiletto.svg'),
	knife_survival_bowie: require('../../images/in-game/weapons/knife_survival_bowie.svg'),
	knife_t: require('../../images/in-game/weapons/knife_t.svg'),
	knife_tactical: require('../../images/in-game/weapons/knife_tactical.svg'),
	knife_ursus: require('../../images/in-game/weapons/knife_ursus.svg'),
	knife_widowmaker: require('../../images/in-game/weapons/knife_widowmaker.svg'),
	knifegg: require('../../images/in-game/weapons/knifegg.svg'),
};

interface Props {
	item: keyof typeof knifeImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type KnifeList = keyof typeof knifeImages;

export const Knife: React.FunctionComponent<Props> = (props: Props) => {
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
			src={knifeImages[props.item]}
		/>
	);
};
