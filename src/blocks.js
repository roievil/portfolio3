import React, { createContext, useRef, useContext } from "react";
import { useFrame, useThree } from "react-three-fiber";
import lerp from "lerp";
import state from "./store";

//
const offsetContext = createContext(0);

/**
 * Un block est un composant permettant de gérer les sections automatiquement,
 *  on definit le nombre de pages et de sections dans store.js
 *  et la navigation s'ajuste (voir sectionHeight)
 * @param {*} param0
 * @returns
 */

function Block({ children, offset, factor, ...props }) {
  const { offset: parentOffset, sectionHeight, aspect } = useBlock();
  console.log("props from blocks.js", props);
  console.log("sectionHeight from blocks.js", sectionHeight);
  console.log("offset from blocks.js", offset);
  const ref = useRef();
  offset = offset !== undefined ? offset : parentOffset;
  useFrame(() => {
    const curY = ref.current.position.y;
    const curTop = state.top.current / aspect;
    ref.current.position.y = lerp(curY, (curTop / state.zoom) * factor, 0.1);
  });
  return (
    <offsetContext.Provider value={offset}>
      <group {...props} position={[0, -sectionHeight * offset * factor, 0]}>
        <group ref={ref}>{children}</group>
      </group>
    </offsetContext.Provider>
  );
}

function useBlock() {
  //get the content of the state
  const { sections, pages, zoom } = state;
  const { size, viewport } = useThree();
  const offset = useContext(offsetContext);
  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;
  const canvasWidth = viewportWidth / zoom;
  const canvasHeight = viewportHeight / zoom;
  const mobile = size.width < 700;
  const margin = canvasWidth * (mobile ? 0.2 : 0.1);
  const contentMaxWidth = canvasWidth * (mobile ? 0.8 : 0.6);
  const sectionHeight = canvasHeight * ((pages - 1) / (sections - 1));
  const aspect = size.height / viewportHeight;
  return {
    aspect,
    viewport,
    offset,
    viewportWidth,
    viewportHeight,
    canvasWidth,
    canvasHeight,
    mobile,
    margin,
    contentMaxWidth,
    sectionHeight,
  };
}

export { Block, useBlock };
