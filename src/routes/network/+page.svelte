<script lang="ts">
	import Graph from './network-graph/graph.svelte';

	import type { ExpandedLinkResponse, TagResponse } from '$lib/types';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	interface GraphNode {
		id: string;
		label: string;
		type: 'link' | 'tag';
	}

	interface GraphEdge {
		source: string;
		target: string;
	}

	interface GraphData {
		nodes: GraphNode[];
		edges: GraphEdge[];
	}

	const prepare_graph_data = (
		links: ExpandedLinkResponse[],
		tags: TagResponse[]
	): GraphData => {
		const nodes: GraphNode[] = [];
		const edges: GraphEdge[] = [];
		const tag_map = new Map<string, TagResponse>();

		// Add all tags as nodes
		tags.forEach((tag) => {
			tag_map.set(tag.id, tag);
			nodes.push({
				id: tag.id,
				label: tag.name,
				type: 'tag',
			});
		});

		links.forEach((link) => {
			// Add link node
			nodes.push({
				id: link.id,
				label: link.title,
				type: 'link',
			});

			// Process tags
			if (Array.isArray(link.tags)) {
				link.tags.forEach((tag_id) => {
					const tag = tag_map.get(tag_id);
					if (tag) {
						// Add edge between link and tag
						edges.push({
							source: link.id,
							target: tag.id,
						});
					}
				});
			}
		});

		return { nodes, edges };
	};

	const graph_data = prepare_graph_data(
		data.user_links,
		data.user_tags
	);
</script>

<h1 class="mb-4 text-2xl font-bold">Network Visualization</h1>

<div>
	<p>Nodes: {graph_data.nodes.length}</p>
	<p>Edges: {graph_data.edges.length}</p>
</div>

<Graph graph={graph_data} />
