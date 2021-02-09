import * as nodecgApiContext from './nodecg-api-context';
const nodecg = nodecgApiContext.get();

import { DummyProducer } from './dummyData';
import { Producer } from '../types/producer';

const producerRep = nodecg.Replicant<Producer>('producer', {
	defaultValue: DummyProducer,
	persistent: false,
});

// Const gameRep = nodecg.Replicant('game', 'csgo-layouts');

nodecg.listenFor('basicShow', (elementName: string) => {
	if (typeof producerRep.value[elementName as keyof Producer] === 'undefined') {
		nodecg.log.error("Trying to show element that doesn't exist: " + elementName);
		return;
	}

	producerRep.value[elementName as keyof Producer] = true;
});

nodecg.listenFor('basicHide', (elementName: string) => {
	if (typeof producerRep.value[elementName as keyof Producer] === 'undefined') {
		nodecg.log.error("Trying to hide element that doesn't exist: " + elementName);
		return;
	}

	producerRep.value[elementName as keyof Producer] = false;
});

// GameRep.on('change', (newVal: any) => {
// 	console.log(newVal.provider.timestamp);
// });
