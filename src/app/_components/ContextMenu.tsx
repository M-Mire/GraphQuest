interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDeleteNode: () => void;
  onMoveNode: () => void;
  onRemoveEdge: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onDeleteNode,
  onMoveNode,
  onRemoveEdge,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    padding: "5px",
    zIndex: 9999,
  };

  const handleDelete = () => {
    onDeleteNode();
    onClose();
  };

  const handleMove = () => {
    onMoveNode();
    onClose();
  };

  const handleRemoveEdge = () => {
    onRemoveEdge();
    onClose();
  };

  return (
    <div style={style}>
      <div onClick={handleDelete}>Delete Node</div>
      <div onClick={handleMove}>Move Node</div>
      <div onClick={handleRemoveEdge}>Remove Edge</div>
    </div>
  );
};

export default ContextMenu;
