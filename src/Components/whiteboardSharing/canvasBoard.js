import React, { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bin/rough';

const roughGenerator = rough.generator();

const CanvasBoard = ({ canvasRef, ctxRef, elements, setElements, tool, color }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  // Set canvas size and context
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Redraw elements whenever they change
  useLayoutEffect(() => {
    if (!canvasRef.current || !Array.isArray(elements)) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const roughCanvas = rough.canvas(canvas);

    // Clear canvas before redrawing
   

    elements.forEach((element) => {
      const drawing = roughCanvas.linearPath(element.path, {
        stroke: element.stroke,
        strokeWidth: 2,
      });
      roughCanvas.draw(drawing);
    });
  }, [elements]);

  // Start drawing
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
if(tool === 'pencil'){
  const newElement = {
      type: tool,
      offsetX,
      offsetY,
      path: [[offsetX, offsetY]],
      stroke: color,
    };

 setElements((prev) => Array.isArray(prev) ? [...prev, newElement] : [newElement]);
    setIsDrawing(true);
}
    
   
  };

  // Continue drawing
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prevElements) => {
      if (!prevElements || prevElements.length === 0) return prevElements;

      const updatedElements = prevElements.map((ele, index) => {
        if (index === prevElements.length - 1) {
          return {
            ...ele,
            path: [...ele.path, [offsetX, offsetY]],
          };
        }
        return ele;
      });

      return updatedElements;
    });
  };

  // Stop drawing
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-white"
      style={{ display: 'block' }}
    />
  );
};

export default CanvasBoard;
