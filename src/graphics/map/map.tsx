import React from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../replicant-store';

import { Map as MapComp } from '../elements/hud/map/map';
import { useReplicant } from 'use-nodecg';

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: 'Josefin Sans';
	/* background: red; */
`;


export const Map: React.FunctionComponent = () => {
	const [scoreBugWidth] = useReplicant<number, number>('scoreBugWidth', 1920);

	return (
		<Provider store={store}>
			<Container>
				<MapComp
					style={{
						position: 'absolute',
						top: scoreBugWidth < 1150 ? 33 : 110,
						left: 25,
						transform: 'scale(0.35)',
						transformOrigin: '0 0',
					}}
				/>
			</Container>
		</Provider>
	);
};

render(<Map />, document.getElementById('map'));
