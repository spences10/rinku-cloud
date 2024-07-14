import type { GraphData, SimulationNode } from './types';
import { get_node_color } from './utils';

export const render_graph = (
	context: CanvasRenderingContext2D,
	graph: GraphData,
	simulation: any,
	get_transform: () => any
) => {
	simulation.on('tick', () => {
		const transform = get_transform();

		context.save();
		context.clearRect(
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);
		context.translate(transform.x, transform.y);
		context.scale(transform.k, transform.k);

		// Draw edges
		graph.edges.forEach((edge) => {
			context.beginPath();
			context.moveTo(
				(edge.source as unknown as SimulationNode).x!,
				(edge.source as unknown as SimulationNode).y!
			);
			context.lineTo(
				(edge.target as unknown as SimulationNode).x!,
				(edge.target as unknown as SimulationNode).y!
			);
			context.strokeStyle = '#999';
			context.lineWidth = 1 / transform.k;
			context.stroke();
		});

		// Draw nodes
		graph.nodes.forEach((node) => {
			const x = (node as SimulationNode).x!;
			const y = (node as SimulationNode).y!;
			const radius = 5 / transform.k;

			// Draw node
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI);
			context.fillStyle = get_node_color(node.type);
			context.fill();

			// Draw text
			const font_size = Math.max(12, 16 / transform.k);
			context.font = `${font_size}px Arial`;
			context.textAlign = 'center';
			context.textBaseline = 'middle';

			// Text background for better visibility
			const text_width = context.measureText(node.label).width;
			const padding = 2 / transform.k;
			context.fillStyle = 'rgba(0, 0, 0, 0)';
			context.fillRect(
				x - text_width / 2 - padding,
				y + radius + padding,
				text_width + padding * 2,
				font_size + padding * 2
			);

			// Draw text
			context.fillStyle = 'black';
			context.fillText(
				node.label,
				x,
				y + radius + font_size / 2 + padding * 2
			);
		});

		context.restore();
	});
};
