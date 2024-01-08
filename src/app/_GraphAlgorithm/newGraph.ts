class NewGraph {
  public graph: Map<number, number[]>;

  constructor() {
    this.graph = new Map();
  }

  dfs(root: number) {
    const stack = [root];
    console.log("push to stack ", root);
    const visited = new Set<number>();

    const result: number[] = [];

    while (stack.length) {
      const vertex = stack.pop();
      console.log("popped from stack ", vertex);
      if (vertex !== undefined && !visited.has(vertex)) {
        console.log(vertex);
        visited.add(vertex);
        result.push(vertex);

        const neighbors = this.graph.get(vertex);
        if (neighbors) {
          for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            stack.push(neighbor!);
            console.log("push to stack: ", neighbor);
          }
        }
      }
      console.log("done with ", vertex);
    }

    return result;
  }
  addEdge(u: number, v: number) {
    if (!this.graph.has(u)) {
      this.graph.set(u, []);
    }
    const uEdges = this.graph.get(u);
    if (uEdges) {
      uEdges.push(v);
    }
  }
  printStack() {
    console.log(this.graph);
  }
}

const k = new NewGraph();
k.addEdge(1, 2);
k.addEdge(1, 3);
k.addEdge(2, 4);
k.addEdge(2, 5);
k.addEdge(3, 6);
k.addEdge(3, 7);
k.addEdge(5, 9);

console.log(k.dfs(1));
