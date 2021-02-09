import React from 'react';

export const grenadeImages = {
	flashbang: require('../../images/in-game/grenades/flashbang.svg'),
	decoy: require('../../images/in-game/grenades/decoy.svg'),
	hegrenade: require('../../images/in-game/grenades/hegrenade.svg'),
	incgrenade: require('../../images/in-game/grenades/incgrenade.svg'),
	molotov: require('../../images/in-game/grenades/molotov.svg'),
	smokegrenade: require('../../images/in-game/grenades/smokegrenade.svg'),
};

interface Props {
	item: keyof typeof grenadeImages;
	active?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type GrenadeList = keyof typeof grenadeImages;

export const Grenades: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			style={{
				...props.style,
				opacity: props.active ? '1' : '0.7',
			}}
			src={grenadeImages[props.item]}
		/>
	);
};
