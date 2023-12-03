import { useState } from "react";
interface ContextMenuProps {
  x: number;
  y: number;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleClick = (action: string) => {
    console.log(`Clicked: ${action}`);
  };

  const handleMouseEnter = (action: string) => {
    setHoveredItem(action);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const contextMenuItemStyle = {
    width: 120,
    padding: 8,
    backgroundColor: "#111", // Darker shade
    border: "2px solid #444", // Border color
    borderRadius: 5,
    color: "white",
    cursor: "pointer",
    opacity: hoveredItem ? (hoveredItem === "Delete Node" ? 0.9 : 1) : 1, // Adjust opacity when hovered
    transition: "opacity 0.3s ease",
  };

  const menuItemBackground = {
    fill: "#111", // Darker shade
    opacity: hoveredItem ? (hoveredItem === "Delete Node" ? 0.9 : 1) : 0,
    transition: "opacity 0.3s ease",
  };

  return (
    <>
      <g transform={`translate(${x}, ${y})`}>
        <rect
          key={`rect-test`}
          width={130}
          height={80}
          fill="none"
          stroke="white"
          strokeWidth={3}
        />
        <rect
          x={10}
          y={15}
          width={100}
          height={30}
          style={menuItemBackground}
          onClick={() => handleClick("Delete Node")}
          onMouseEnter={() => handleMouseEnter("Delete Node")}
          onMouseLeave={handleMouseLeave}
        />
        <text
          x={10}
          y={25}
          style={contextMenuItemStyle}
          onClick={() => handleClick("Delete Node")}
          onMouseEnter={() => handleMouseEnter("Delete Node")}
          onMouseLeave={handleMouseLeave}
        >
          Delete Node
        </text>
        <rect
          x={10}
          y={45}
          width={100}
          height={30}
          style={menuItemBackground}
          onClick={() => handleClick("Move Node")}
          onMouseEnter={() => handleMouseEnter("Move Node")}
          onMouseLeave={handleMouseLeave}
        />
        <text
          x={10}
          y={55}
          style={contextMenuItemStyle}
          onClick={() => handleClick("Move Node")}
          onMouseEnter={() => handleMouseEnter("Move Node")}
          onMouseLeave={handleMouseLeave}
        >
          Move Node
        </text>
      </g>
    </>
  );
};

export default ContextMenu;
