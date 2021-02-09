import { createStore } from 'redux';
import clone from 'clone';
import { ReplicantBrowser } from '../../../../types/browser';
import * as DummyData from '../extensions/dummyData';
import { Match } from '../types/matches';

const replicantNames = [
	'game',
	'matchStats',
	'allPlayers',
	'observingPlayer',
	'bomb',
	'phase',
	'playerData',
	'teamOne',
	'teamTwo',
	'swapTeams',
	'gameSettings',
	'matchKills',
	'mapGrenades',
	'matches',
	'currentMatch',
	'mapPlayers',
	'interpMapPlayers'
];
const replicants: ReplicantBrowser<unknown>[] = [];

const initialState = {
	game: DummyData.game,
	matchStats: DummyData.match,
	allPlayers: DummyData.player,
	observingPlayer: DummyData.observingPlayer,
	bomb: DummyData.bomb,
	phase: DummyData.phase,
	playerData: DummyData.ExtraData,
	teamOne: DummyData.TeamData,
	teamTwo: DummyData.TeamDataTwo,
	swapTeams: false,
	gameSettings: DummyData.gameSettings,
	matchKills: [],
	mapGrenades: DummyData.DummyGrenadesAll,
	matches: [],
	currentMatch: undefined as Match | undefined,
	mapPlayers: DummyData.MapPostions,
	interpMapPlayers: DummyData.InterpMapPositions,
};

function replicantReducer(
	// eslint-disable-next-line default-param-last
	state = initialState,
	action: { type: string; name: string; value: unknown },
) {
	switch (action.type) {
		case 'updateReplicant':
			return { ...state, [action.name]: action.value };

		default:
			return state;
	}
}

export const store = createStore(replicantReducer);

export type stateType = typeof initialState;

replicantNames.forEach((name) => {
	const replicant = nodecg.Replicant(name, 'nodecg-csgo-manager');

	replicant.on('change', (newVal) => {
		store.dispatch({ type: 'updateReplicant', name: replicant.name, value: clone(newVal) });
	});

	replicants.push(replicant);
});
