import { createPortal } from "react-dom";

type OverlayInfo = { 
  d: string; 
  matrix: string;
  dimensions: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
} | null;

function CountryOverlay({ info, container, onClose, fillColor }: { info: OverlayInfo; container: HTMLElement | null; onClose: ()=>void; fillColor: string }) {
  if (!container || !info) return null;
  // render via portal into same parent as map so absolute positioning is correct
  return createPortal(
    <div style={{ 
        position: 'absolute',
        top: info.dimensions.top,
        left: info.dimensions.left,
        width: info.dimensions.width,
        height: info.dimensions.height,
        pointerEvents: 'auto',
        zIndex: 1210,
        filter: 'blur(0px)', // counteract parent blur/brightness
      }}>
      <svg
        width={info.dimensions.width}
        height={info.dimensions.height}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        <path
          d={info.d}
          transform={info.matrix ?? undefined}
          fill={fillColor}
          stroke="#e85a4f"
          style={{
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.45)) blur(0px)',
            vectorEffect: 'non-scaling-stroke',
          }}
        />
      </svg>
      <button onClick={onClose} style={{ position: 'absolute', right: 12, top: 12, zIndex: 1210, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>✕</button>
    </div>,
    container
  );
}

export default CountryOverlay;