import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HUD } from './hud';
// import { Map } from '../elements/fui/map/map';
import { store } from '../replicant-store';

// import {useReplicant} from 'use-nodecg';

const Game: React.FC = () => {
	// const [scoreBugWidth] = useReplicant<number, number>('scoreBugWidth', 1920);

	return (
		<Provider store={store}>
			<HUD />
			{/* <Map
				style={{
					position: 'absolute',
					top: scoreBugWidth < 1150 ? 33 : 110,
					left: 20,
					transform: 'scale(0.35)',
					transformOrigin: '0 0',
				}}
			/> */}
		</Provider>
	);
};

render(<Game />, document.getElementById('game'));
