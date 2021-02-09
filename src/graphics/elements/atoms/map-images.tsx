/* eslint-disable camelcase */
import React from 'react';

export const MapRawImages = {
	de_dust2: require('../../images/radar_map/de_dust2.png'),
	de_inferno: require('../../images/radar_map/de_inferno.png'),
	de_nuke: require('../../images/radar_map/de_nuke.png'),
	de_nuke_lower: require('../../images/radar_map/de_nuke_lower.png'),
	de_mirage: require('../../images/radar_map/de_mirage.png'),
	de_cache: require('../../images/radar_map/de_cache.png'),
	de_overpass: require('../../images/radar_map/de_overpass.png'),
	de_train: require('../../images/radar_map/de_train.png'),
	de_vertigo: require('../../images/radar_map/de_vertigo.png'),
	de_vertigo_lower: require('../../images/radar_map/de_vertigo_lower.png'),
};

interface Props {
	map: keyof typeof MapRawImages;
	className?: string;
}

export type MapList = keyof typeof MapRawImages;

export const MapImages: React.FC<Props> = (props: Props) => {
	return <img className={props.className} src={MapRawImages[props.map]} />;
};
