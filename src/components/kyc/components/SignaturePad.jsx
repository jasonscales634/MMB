import React, { useRef, useEffect, useState } from "react";

const SignaturePad = ({ value, onChange }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000";

    setCtx(context);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    if (e.touches?.length) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;

    const dataURL = canvasRef.current.toDataURL("image/png");
    onChange(dataURL);
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={350}
        height={180}
        className="border w-full rounded"
        style={{ touchAction: "none", background: "#fff" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <button
        type="button"
        onClick={clear}
        className="text-red-500 text-sm mt-2"
      >
        Clear Signature
      </button>
    </div>
  );
};

export default SignaturePad;
