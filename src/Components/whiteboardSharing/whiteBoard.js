import React, { useRef, useState } from 'react';
import CanvasBoard from './canvasBoard';
import 'bootstrap/dist/css/bootstrap.min.css';


function WhiteBoard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [elements, setElements] = useState([]);

  return (
    <div className="container py-4">
      <h2 className="text-center text-primary border-bottom pb-2 mb-4 fw-bold">
        🎨 Play with Board
      </h2>

      <div className="row g-4">
        <div className="col-md-4">
          <label className="form-label fw-semibold text-white">Choose Tool:</label>
          <div className="btn-group w-100" role="group">
            {['pencil', 'rectangle', 'line'].map((t) => (
              <React.Fragment key={t}>
                <input
                  type="radio"
                  className="btn-check"
                  name="tool"
                  id={t}
                  value={t}
                  checked={tool === t}
                  onChange={(e) => setTool(e.target.value)}
                />
                <label className="btn btn-outline-secondary" htmlFor={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <label htmlFor="colorPicker" className="form-label fw-semibold text-white">Pick Color:</label>
          <input
            type="color"
            className="form-control form-control-color"
            id="colorPicker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Choose your color"
          />
        </div>

        <div className="col-md-4 d-flex flex-column justify-content-end gap-2">
          <button className="btn btn-outline-primary">↩️ Undo</button>
          <button className="btn btn-outline-primary">↪️ Redo</button>
          <button className="btn btn-danger">🧹 Clear Canvas</button>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-center h-96">
        <div className="border rounded shadow bg-white">
          <CanvasBoard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}

export default WhiteBoard;
