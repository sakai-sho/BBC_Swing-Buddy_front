'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Eraser, Pencil, Minus, MoveRight, Square, Circle,
  RotateCcw, RotateCw, Download,
} from 'lucide-react';

type Tool = 'pen' | 'line' | 'arrow' | 'rect' | 'circle' | 'erase';
type DrawCmd =
  | { t: 'pen' | 'erase'; color: string; width: number; points: Array<[number, number]> }
  | { t: 'line' | 'arrow' | 'rect' | 'circle'; color: string; width: number; from: [number, number]; to: [number, number] };

type Props = { src: string; time?: number; onChange?: (exportedUrl: string) => void; };

const SnapshotAnnotator: React.FC<Props> = ({ src, time, onChange }) => {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const tmpRef  = useRef<HTMLCanvasElement>(null);

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const dprRef = useRef<number>(1);

  // 表示サイズ（親の幅にフィット、max-height: 60vh）
  const [cssW, setCssW] = useState(0);
  const [cssH, setCssH] = useState(0);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#ffffff');
  const [width, setWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const startPos = useRef<[number, number] | null>(null);
  const penPts = useRef<Array<[number, number]>>([]);

  const [stack, setStack] = useState<DrawCmd[]>([]);
  const [redoStack, setRedoStack] = useState<DrawCmd[]>([]);

  // 画像読み込み
  useEffect(() => {
    const i = new Image();
    // dataURL なので crossOrigin は付けない
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  // リサイズ + 初期描画
  useEffect(() => {
    if (!img) return;
    dprRef.current = window.devicePixelRatio || 1;

    const resizeAndRedraw = () => {
      // ★ 外側の幅があるコンテナ（borderのdiv）を基準にする
      const outer = baseRef.current?.parentElement?.parentElement as HTMLElement | null;
      const container = outer ?? baseRef.current?.parentElement ?? document.body;
      const containerWidth = container ? container.clientWidth : 360;

      const aspect = img.height / img.width;
      const targetCssW = Math.min(containerWidth, 1000);
      const targetCssH = Math.min(Math.floor(targetCssW * aspect), Math.floor(window.innerHeight * 0.6));

      setCssW(targetCssW);
      setCssH(targetCssH);

      // 実ピクセル反映
      [baseRef.current, tmpRef.current].forEach((cvs) => {
        if (!cvs) return;
        cvs.width  = Math.floor(targetCssW * dprRef.current);
        cvs.height = Math.floor(targetCssH * dprRef.current);
        cvs.style.width  = `${targetCssW}px`;
        cvs.style.height = `${targetCssH}px`;
      });

      redrawAll(targetCssW, targetCssH);
    };

    resizeAndRedraw();
    const ro = new ResizeObserver(resizeAndRedraw);
    const observeTarget = baseRef.current?.parentElement?.parentElement ?? baseRef.current?.parentElement ?? undefined;
    if (observeTarget) ro.observe(observeTarget);
    window.addEventListener('resize', resizeAndRedraw);
    return () => { ro.disconnect(); window.removeEventListener('resize', resizeAndRedraw); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  // スタック変更 → 再描画
  useEffect(() => {
    if (cssW && cssH) redrawAll(cssW, cssH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack]);

  const redrawAll = (w: number, h: number) => {
    if (!img || !baseRef.current) return;
    const b = baseRef.current;
    const ctx = b.getContext('2d')!;
    const dpr = dprRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, b.width, b.height);
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, 0, 0, w, h);

    for (const cmd of stack) drawCmd(ctx, cmd);

    // tmp clear
    if (tmpRef.current) {
      const t = tmpRef.current.getContext('2d')!;
      tmpRef.current.width = tmpRef.current.width;
      t.scale(dpr, dpr);
    }
  };

  const drawCmd = (ctx: CanvasRenderingContext2D, cmd: DrawCmd) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = cmd.width;
    ctx.strokeStyle = cmd.t === 'erase' ? 'rgba(0,0,0,1)' : cmd.color;
    ctx.globalCompositeOperation = cmd.t === 'erase' ? 'destination-out' : 'source-over';

    const line = (a: [number, number], b: [number, number]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };

    switch (cmd.t) {
      case 'pen':
      case 'erase':
        for (let i = 1; i < cmd.points.length; i++) line(cmd.points[i-1], cmd.points[i]);
        break;
      case 'line':
        line(cmd.from, cmd.to); break;
      case 'arrow': {
        line(cmd.from, cmd.to);
        const head = 10; const ang = Math.atan2(cmd.to[1]-cmd.from[1], cmd.to[0]-cmd.from[0]);
        line(cmd.to, [cmd.to[0]-head*Math.cos(ang-Math.PI/6), cmd.to[1]-head*Math.sin(ang-Math.PI/6)]);
        line(cmd.to, [cmd.to[0]-head*Math.cos(ang+Math.PI/6), cmd.to[1]-head*Math.sin(ang+Math.PI/6)]);
        break;
      }
      case 'rect':
        ctx.strokeRect(Math.min(cmd.from[0], cmd.to[0]), Math.min(cmd.from[1], cmd.to[1]),
                       Math.abs(cmd.to[0]-cmd.from[0]), Math.abs(cmd.to[1]-cmd.from[1])); break;
      case 'circle': {
        const cx=(cmd.from[0]+cmd.to[0])/2, cy=(cmd.from[1]+cmd.to[1])/2;
        const rx=Math.abs(cmd.to[0]-cmd.from[0])/2, ry=Math.abs(cmd.to[1]-cmd.from[1])/2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke(); break;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  // 座標変換：イベント → CSS座標
  const ev2pt = (e: React.MouseEvent): [number, number] => {
    const rect = baseRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const onDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const p = ev2pt(e);
    startPos.current = p;
    penPts.current = [p];

    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, p, p);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const p = ev2pt(e);

    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, startPos.current!, p);

    if (tool === 'pen' || tool === 'erase') {
      penPts.current.push(p);
      const ctx = baseRef.current!.getContext('2d')!;
      drawCmd(ctx, { t: tool, color, width, points: [penPts.current.at(-2)!, p] });
    }
  };

  const onUp = (e: React.MouseEvent) => {
    if (!drawing) return;
    setDrawing(false);
    const p = ev2pt(e);

    const cmd: DrawCmd =
      (tool === 'pen' || tool === 'erase')
        ? { t: tool, color, width, points: penPts.current }
        : { t: tool, color, width, from: startPos.current!, to: p };

    setStack((s) => [...s, cmd]);
    setRedoStack([]);
    if (tmpRef.current) tmpRef.current.width = tmpRef.current.width;
  };

  const drawPreview = (ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) => {
    const cmd: DrawCmd = (tool === 'pen' || tool === 'erase')
      ? { t: tool, color, width, points: [from, to] }
      : { t: tool, color, width, from, to };
    drawCmd(ctx, cmd);
  };

  const undo = () => setStack((s) => (s.length ? (setRedoStack(r => [...r, s[s.length-1]]), s.slice(0, -1)) : s));
  const redo = () => setRedoStack((r) => (r.length ? (setStack(s => [...s, r[r.length-1]]), r.slice(0, -1)) : r));
  const clearAll = () => { setStack([]); setRedoStack([]); };
  const exportPng = () => {
    const url = baseRef.current!.toDataURL('image/png');
    onChange?.(url);
    const a = document.createElement('a'); a.href = url; a.download = 'snapshot-annotated.png'; a.click();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3 text-white">
      {/* ツールバー */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="text-sm opacity-80">静止画マークアップ{typeof time === 'number' ? `（${Math.floor(time)}s）` : ''}</div>
        <div className="flex items-center gap-1">
          <button title="ペン" onClick={() => setTool('pen')} className={`px-2 py-1 rounded ${tool==='pen'?'bg-white text-purple-600':'bg-white/10'}`}><Pencil size={16}/></button>
          <button title="直線" onClick={() => setTool('line')} className={`px-2 py-1 rounded ${tool==='line'?'bg-white text-purple-600':'bg-white/10'}`}><Minus size={16}/></button>
          <button title="矢印" onClick={() => setTool('arrow')} className={`px-2 py-1 rounded ${tool==='arrow'?'bg-white text-purple-600':'bg-white/10'}`}><MoveRight size={16}/></button>
          <button title="矩形" onClick={() => setTool('rect')} className={`px-2 py-1 rounded ${tool==='rect'?'bg-white text-purple-600':'bg-white/10'}`}><Square size={16}/></button>
          <button title="円" onClick={() => setTool('circle')} className={`px-2 py-1 rounded ${tool==='circle'?'bg-white text-purple-600':'bg-white/10'}`}><Circle size={16}/></button>
          <button title="消しゴム" onClick={() => setTool('erase')} className={`px-2 py-1 rounded ${tool==='erase'?'bg-white text-purple-600':'bg-white/10'}`}><Eraser size={16}/></button>

          <select value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="ml-2 text-black text-xs rounded px-1 py-0.5">
            <option value={2}>2px</option><option value={3}>3px</option><option value={4}>4px</option><option value={6}>6px</option>
          </select>

          <div className="ml-2 flex gap-1">
            {['#ffffff','#ffeb3b','#ff4d4f','#00e676'].map(c=>(
              <button key={c} onClick={()=>setColor(c)} className="w-5 h-5 rounded-full border border-white/30" style={{background:c, outline: color===c ? '2px solid rgba(255,255,255,0.9)' : 'none'}} />
            ))}
          </div>

          <button title="元に戻す" onClick={undo} className="ml-2 px-2 py-1 rounded bg-white/10"><RotateCcw size={16}/></button>
          <button title="やり直し" onClick={redo} className="px-2 py-1 rounded bg-white/10"><RotateCw size={16}/></button>
          <button title="画像として書き出し" onClick={exportPng} className="px-2 py-1 rounded bg-green-600 hover:bg-green-700"><Download size={16}/></button>
        </div>
      </div>

      {/* 表示領域：幅は親いっぱい / 高さは算出値（0で描画されないのを防ぐ） */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10" style={{ maxHeight: '60vh' }}>
        <div className="relative" style={{ width: (cssW || 1), height: (cssH || 1) }}>
          <canvas ref={baseRef} className="block absolute inset-0 w-full h-full" />
          <canvas
            ref={tmpRef}
            className="block absolute inset-0 w-full h-full"
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
          />
        </div>
      </div>

      {stack.length > 0 && (
        <div className="mt-2 text-right">
          <button onClick={clearAll} className="px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20">すべて消去</button>
        </div>
      )}
    </div>
  );
};

export default SnapshotAnnotator;
