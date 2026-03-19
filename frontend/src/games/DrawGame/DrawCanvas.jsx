import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Box, IconButton, Slider, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const COLORS = [
  '#FFFFFF', '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#38BDF8', '#818CF8', '#E879F9', '#000000', '#94A3B8',
];

const DrawCanvas = forwardRef(function DrawCanvas({ disabled }, ref) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState('pen'); // pen | eraser
  const drawing = useRef(false);
  const lastPos = useRef(null);

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    getDataURL() {
      return canvasRef.current?.toDataURL();
    },
  }));

  // Init canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  }, [disabled]);

  const draw = useCallback((e) => {
    if (!drawing.current || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#0F172A' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  }, [color, brushSize, tool, disabled]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* Canvas */}
      <Box sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid rgba(168,85,247,0.4)',
        boxShadow: '0 0 30px rgba(168,85,247,0.2)',
        cursor: disabled ? 'not-allowed' : tool === 'eraser' ? 'cell' : 'crosshair',
        width: '100%',
        maxWidth: 520,
        aspectRatio: '4/3',
      }}>
        <canvas
          ref={canvasRef}
          width={520}
          height={390}
          style={{ display: 'block', width: '100%', height: '100%' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </Box>

      {/* Toolbar */}
      {!disabled && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
          justifyContent: 'center',
          p: 1.5, borderRadius: '14px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          width: '100%', maxWidth: 520,
        }}>
          {/* Colors */}
          <Box display="flex" gap={0.5} flexWrap="wrap" justifyContent="center">
            {COLORS.map(c => (
              <Box
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                sx={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: c,
                  cursor: 'pointer',
                  border: color === c && tool === 'pen'
                    ? '2px solid #A855F7'
                    : '2px solid rgba(255,255,255,0.15)',
                  boxShadow: color === c && tool === 'pen' ? '0 0 8px #A855F7' : 'none',
                  transition: 'all 0.15s',
                  transform: color === c && tool === 'pen' ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </Box>

          {/* Divider */}
          <Box sx={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

          {/* Eraser */}
          <Tooltip title="Eraser">
            <Box
              onClick={() => setTool(t => t === 'eraser' ? 'pen' : 'eraser')}
              sx={{
                px: 1.5, py: 0.5, borderRadius: '8px', cursor: 'pointer',
                fontSize: 18,
                background: tool === 'eraser' ? 'rgba(168,85,247,0.3)' : 'transparent',
                border: `1px solid ${tool === 'eraser' ? '#A855F7' : 'rgba(255,255,255,0.1)'}`,
                userSelect: 'none',
              }}
            >
              🧹
            </Box>
          </Tooltip>

          {/* Brush size */}
          <Box sx={{ width: 100 }}>
            <Slider
              min={2} max={24} value={brushSize}
              onChange={(_, v) => setBrushSize(v)}
              size="small"
              sx={{ color: '#A855F7' }}
            />
          </Box>

          {/* Clear */}
          <Tooltip title="Clear canvas">
            <IconButton onClick={clearCanvas} size="small" sx={{ color: '#F87171' }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
});

export default DrawCanvas;
