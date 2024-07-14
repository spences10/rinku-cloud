export const fit_to_container = (node: HTMLCanvasElement) => {
	const dpi = window.devicePixelRatio || 1;
	const parent = node.parentElement;

	if (parent) {
		const { width, height } = parent.getBoundingClientRect();
		node.width = width * dpi;
		node.height = height * dpi;
		node.style.width = `${width}px`;
		node.style.height = `${height}px`;
	}
};

export const get_node_color = (node_type: 'link' | 'tag') =>
	node_type === 'link' ? '#01abfc' : '#F9123B';
