import type {
	SimulationLinkDatum,
	SimulationNodeDatum,
} from 'd3-force';

export interface GraphNode {
	id: string;
	label: string;
	type: 'link' | 'tag';
}

export interface GraphLink {
	source: string;
	target: string;
}

export interface GraphData {
	nodes: GraphNode[];
	edges: GraphLink[];
}

export interface SimulationNode
	extends GraphNode,
		SimulationNodeDatum {}

export interface SimulationLink
	extends SimulationLinkDatum<SimulationNode> {
	source: string | SimulationNode;
	target: string | SimulationNode;
}
