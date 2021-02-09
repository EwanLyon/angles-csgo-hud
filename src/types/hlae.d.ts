export interface GameEvent {
    name: string;
    clientTime: number;
    keys: Record<string, any>;
    round: number;
}

export interface PlayerDeath {
    name: string;
    clientTime: number;
    keys: PlayerDeathKeys;
    round: number;
}

interface PlayerDeathKeys {
    userid: Assister;
    attacker: Assister;
    assister: Assister;
    assistedflash: boolean;
    weapon: string;
    weaponItemid: string;
    weaponFauxitemid: string;
    weaponOriginalownerXuid: string;
    headshot: boolean;
    dominated: number;
    revenge: number;
    wipe: number;
    penetrated: number;
    noreplay: boolean;
    noscope: boolean;
    thrusmoke: boolean;
    attackerblind: boolean;
    distance: number;
}

interface Assister {
    value: number;
    xuid: string;
    eyeOrigin: number[];
    eyeAngles: number[];
}

export interface WeaponFire {
    name:       string;
    clientTime: number;
    keys:       Keys;
    round:      number;
}

export interface Keys {
    userid:   Userid;
    weapon:   string;
    silenced: boolean;
}

export interface Userid {
    value:     number;
    xuid:      string;
    eyeOrigin: number[];
    eyeAngles: number[];
}
