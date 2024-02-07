export enum AlgorithmEnum {
  BFS = "BFS",
  Dijkstra = "Dijkstra",
  DFS = "DFS",
  GreedyBFS = "GreedyBFS",
  AStar = "AStar",
}

export const algorithmMap: Record<AlgorithmEnum, { name: string }> = {
  [AlgorithmEnum.BFS]: { name: "BFS" },
  [AlgorithmEnum.Dijkstra]: { name: "Dijkstra" },
  [AlgorithmEnum.DFS]: { name: "DFS" },
  [AlgorithmEnum.GreedyBFS]: { name: "GreedyBFS" },
  [AlgorithmEnum.AStar]: { name: "AStar" },
};
