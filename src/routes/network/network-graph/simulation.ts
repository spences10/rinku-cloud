import { drag } from 'd3-drag';
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
} from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';

import type {
	GraphData,
	GraphNode,
	SimulationLink,
	SimulationNode,
} from './types';

export const create_simulation = (
	graph: GraphData,
	width: number,
	height: number,
	context: CanvasRenderingContext2D,
	on_node_hover: (node: GraphNode | null) => void
) => {
	let transform = zoomIdentity;

	const simulation = forceSimulation(graph.nodes as SimulationNode[])
		.force(
			'link',
			forceLink(graph.edges as unknown as SimulationLink[])
				.id((d: any) => d.id)
				.distance(100)
				.strength(0.1)
		)
		.force('charge', forceManyBody().strength(-30).distanceMax(200))
		.force('center', forceCenter(width / 2, height / 2))
		.force('collide', forceCollide().radius(30))
		.alphaDecay(0.1)
		.velocityDecay(0.3);

	const drag_subject = (event: any) => {
		const [x, y] = transform.invert([event.x, event.y]);
		return simulation.find(x, y, 20);
	};

	const drag_started = (event: any) => {
		if (!event.active) simulation.alphaTarget(0.1).restart();
		const [x, y] = transform.invert([event.x, event.y]);
		event.subject.fx = x;
		event.subject.fy = y;
	};

	const dragged = (event: any) => {
		const [x, y] = transform.invert([event.x, event.y]);
		event.subject.fx = x;
		event.subject.fy = y;
	};

	const drag_ended = (event: any) => {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	};

	const zoomed = (event: any) => {
		transform = event.transform;
		simulation.alpha(0.1).restart();
	};

	select(context.canvas)
		.call(
			drag<any, any>()
				.subject(drag_subject)
				.on('start', drag_started)
				.on('drag', dragged)
				.on('end', drag_ended)
		)
		.call(zoom<any, any>().scaleExtent([0.1, 4]).on('zoom', zoomed));

	select(context.canvas).on('mousemove', (event: any) => {
		const [x, y] = transform.invert([event.offsetX, event.offsetY]);
		const node = simulation.find(
			x,
			y,
			20 / transform.k
		) as GraphNode | null;
		on_node_hover(node);
	});

	return {
		simulation,
		get_transform: () => transform,
	};
};
