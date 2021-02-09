import React from 'react';

import { PrimaryWeapon, primaryWeaponImages, PrimaryWeaponList } from '../../atoms/primary-weapons';
import { SecondaryWeapon, secondaryWeaponImages, SecondaryWeaponList } from '../../atoms/secondary-weapons';
import { Grenades, grenadeImages, GrenadeList } from '../../atoms/grenades';
import { Knife, knifeImages, KnifeList } from '../../atoms/knife';

const specialKillIcons = {
	'inferno': require('../../../images/in-game/weapons/inferno.svg')
}

interface Props {
	weapon: string
}

export const KillIcon: React.FC<Props> = (props: Props) => {
	let weaponImage = <></>;
	if (isPrimaryWeapon(props.weapon)) {
		weaponImage = <PrimaryWeapon active style={{ height: '60%' }} item={props.weapon} />;
	} else if (isSecondaryWeapon(props.weapon)) {
		weaponImage = <SecondaryWeapon active style={{ height: '60%' }} item={props.weapon} />;
	} else if (isSpecialKillIcon(props.weapon)) {
		weaponImage = <img style={{ height: '60%' }} src={specialKillIcons[props.weapon]} />;
	} else if (isGrenade(props.weapon)) {
		weaponImage = <Grenades active style={{ height: '60%' }} item={props.weapon} />;
	} else if (isKnife(props.weapon)) {
		weaponImage = <Knife active style={{ height: '60%' }} item={props.weapon} />;
	} else {
		console.log('Missing kill icon: ' + props.weapon);
	}

	return weaponImage;
};

function isPrimaryWeapon(weapon: string): weapon is PrimaryWeaponList {
	return weapon in primaryWeaponImages;
}

function isSecondaryWeapon(weapon: string): weapon is SecondaryWeaponList {
	return weapon in secondaryWeaponImages;
}

function isGrenade(grenade: string): grenade is GrenadeList {
	return grenade in grenadeImages;
}

function isKnife(knife: string): knife is KnifeList {
	return knife in knifeImages;
}

function isSpecialKillIcon(weapon: string): weapon is keyof typeof specialKillIcons {
	return weapon in specialKillIcons;
}
