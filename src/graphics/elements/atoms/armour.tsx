import React from 'react';

const armourImages = {
	helmet: require('../../images/in-game/ArmourHelmet SVG.svg'),
	normal: require('../../images/in-game/Armour SVG.svg'),
};

interface Props {
	item: keyof typeof armourImages;
	className?: string;
}

export const Armour: React.FunctionComponent<Props> = (props: Props) => {
	return <img className={props.className} src={armourImages[props.item]} />;
};
