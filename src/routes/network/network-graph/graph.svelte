<script lang="ts">
	import { forceCenter } from 'd3-force';
	import { onMount } from 'svelte';
	import { render_graph } from './renderer';
	import { create_simulation } from './simulation';

	import type { Simulation } from 'd3-force';
	import type { GraphData, GraphNode, SimulationNode } from './types';

	interface Props {
		graph: GraphData;
	}

	let { graph }: Props = $props();

	let container_div: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let width = $state(0);
	let height = $state(0);
	let active_node = $state<GraphNode | null>(null);
	let context: CanvasRenderingContext2D;
	let simulation: Simulation<SimulationNode, undefined>;

	const update_size = () => {
		if (container_div && canvas) {
			const rect = container_div.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			canvas.width = width * window.devicePixelRatio;
			canvas.height = height * window.devicePixelRatio;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;

			if (simulation) {
				simulation.force(
					'center',
					forceCenter(width / 2, height / 2)
				);
				simulation.alpha(0.3).restart();
			}
		}
	};

	onMount(() => {
		context = canvas.getContext('2d')!;
		update_size();

		const { simulation: sim, get_transform } = create_simulation(
			graph,
			width,
			height,
			context,
			(node) => {
				active_node = node;
			}
		);
		simulation = sim;
		render_graph(context, graph, simulation, get_transform);

		// Stop the simulation after initial layout
		setTimeout(() => {
			simulation.stop();
		}, 3000); // Adjust time as needed
	});

	$effect(() => {
		update_size();
	});
</script>

<svelte:window on:resize={update_size} />

<div bind:this={container_div} class="container">
	{#if active_node}
		<div id="nodeDetails">
			<strong>{active_node.label}</strong>
			<br />
			Type: {active_node.type}
		</div>
	{/if}
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	#nodeDetails {
		position: absolute;
		top: 1%;
		left: 1%;
		width: unset;
		color: #eee;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 5px;
		border-radius: 5px;
	}
</style>
