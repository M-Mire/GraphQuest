import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "~/app/_components/SharedUI/Navbar";
import EditMode from "~/app/_components/CanvasElements/EditMode";
import MultiSwitcher from "./SharedUI/MultiSwitcher";
import { ACTIONS_NODE } from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import Animation, {
  type ActionLine,
} from "~/app/_components/CanvasElements/Animation";
import { Line } from "~/app/_GraphAlgorithm/Graph";
import { useState, useReducer } from "react";
import type pageConfigurationType from "~/app/_pageConfigs/config";
import type Node from "~/app/model/Node";
import Alert from "~/app/_components/SharedUI/Alert";
import type { Alerts } from "~/app/_components/SharedUI/Alert";
import { useThemeContext } from "../context/ThemeContext";
import useMinCanvas from "../hooks/useMinCanvas";
import useNodeManagement from "../hooks/useNodeManagement";
import useQueryString from "../hooks/useQueryString";
import useAnimationManagement from "../hooks/useAnimationManagement";
import ControlButtons from "./SharedUI/ControlButtons";
import useThemeBackground from "../hooks/useThemeBackground";

interface PageProps {
  pageConfiguration: pageConfigurationType;
}

const MainPage: React.FC<PageProps> = ({ pageConfiguration }) => {
  const { theme } = useThemeContext();
  const searchParams = useSearchParams();
  const urlNodes = searchParams?.getAll("node") || [];

  const {
    speed,
    setSpeed,
    isPlay,
    setPlay,
    rootValue,
    setRootValue,
    currentIndex,
    setCurrentIndex,
    lineNumbers,
    dispatchLineNumbers,
  } = useAnimationManagement();

  const { nodes, dispatch } = useNodeManagement();

  const isEditMode = searchParams && searchParams.get("edit") === "true";

  const [isMultiSwitcherActive, setMultiSwitcher] = useState(false);
  const [alert, setAlert] = useState<Alerts | null>(null);
  const minCanvas = useMinCanvas(nodes, urlNodes);

  const { createQueryString, deleteQueryString } = useQueryString();

  useThemeBackground();

  useEffect(() => {
    if (isEditMode) {
      dispatch({
        type: ACTIONS_NODE.NODE_RESET,
        payload: NaN,
      });
      setCurrentIndex(0);
      setPlay(false);
      dispatchLineNumbers({
        type: Line.LineReset,
        payload: 0,
      });
    }
  }, [isEditMode]);

  const clearNodes = () => {
    dispatch({
      type: ACTIONS_NODE.DELETE_ALL,
      payload: -1,
    });
    setCurrentIndex(0);
    setPlay(false);
    dispatchLineNumbers({
      type: Line.LineReset,
      payload: 0,
    });
  };

  const handleNodeReset = () => {
    dispatch({
      type: ACTIONS_NODE.NODE_RESET,
      payload: NaN,
    });
    setCurrentIndex(-1);
    dispatchLineNumbers({
      type: Line.LineReset,
      payload: 0,
    });
  };

  return (
    <>
      <div className="relative flex h-screen flex-col">
        <Navbar
          dispatch={dispatch}
          algorithmName={pageConfiguration.algorithmName}
          pageConfiguration={pageConfiguration}
        >
          <ControlButtons
            setSpeed={setSpeed}
            speed={speed}
            dispatch={dispatch}
            setCurrentIndex={setCurrentIndex}
            setPlay={setPlay}
            isPlay={isPlay}
            dispatchLineNumbers={dispatchLineNumbers}
          />
        </Navbar>
        <div
          className="relative h-full"
          style={{ background: theme.background.primary }}
        >
          {isEditMode ? (
            <>
              <Alert alert={alert} setAlert={setAlert} />
              <EditMode
                dispatch={dispatch}
                nodes={nodes}
                isWeighted={pageConfiguration.isWeighted}
                setAlert={setAlert}
                minCanvas={minCanvas}
                isUndirectedGraph={pageConfiguration.isUndirectedGraph}
              />
            </>
          ) : (
            <Animation
              nodes={nodes}
              setRootValue={setRootValue}
              rootValue={rootValue}
              dispatch={dispatch}
              speed={speed}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              isPlay={isPlay}
              lineNumbers={lineNumbers}
              dispatchLineNumbers={dispatchLineNumbers}
              runAlgorithm={pageConfiguration.runAlgorithm}
              code={pageConfiguration.code}
              algorithmName={pageConfiguration.algorithmName}
              isWeighted={pageConfiguration.isWeighted}
              addEdge={pageConfiguration.addEdge}
              pageID={pageConfiguration.id}
              minCanvas={minCanvas}
              isUndirectedGraph={pageConfiguration.isUndirectedGraph}
              setPlay={setPlay}
              handleNodeReset={handleNodeReset}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;
