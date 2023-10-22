export interface Node {
    id: number;
    x: number;
    y: number;
    visited: boolean;
    visitedChildrens: boolean;
    childNodes: Set<Node>;
}
