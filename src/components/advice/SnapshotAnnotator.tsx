'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react'; // useCallback をインポート
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

  // Helper function to draw a single command onto a context
  // drawCmd は自身が依存する状態 (tool, color, width) を持たないため、依存配列は空でOK
  const drawCmd = useCallback((ctx: CanvasRenderingContext2D, cmd: DrawCmd) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = cmd.width;
    ctx.strokeStyle = cmd.t === 'erase' ? 'rgba(0,0,0,1)' : cmd.color; // Eraser uses transparent overlay
    ctx.globalCompositeOperation = cmd.t === 'erase' ? 'destination-out' : 'source-over';

    const line = (a: [number, number], b: [number, number]) => {
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    };

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
                       Math.abs(cmd.to[0]-cmd.from[0]), Math.abs(cmd.to[1]-cmd.from[1]));
        break;
      case 'circle': {
        const cx=(cmd.from[0]+cmd.to[0])/2, cy=(cmd.from[1]+cmd.to[1])/2;
        const rx=Math.abs(cmd.to[0]-cmd.from[0])/2, ry=Math.abs(cmd.to[1]-cmd.from[1])/2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke(); break;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  // All drawing commands on base canvas (memoized)
  const redrawAll = useCallback(() => {
    if (!img || !baseRef.current) return;
    const b = baseRef.current;
    const ctx = b.getContext('2d')!;
    const dpr = dprRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, b.width, b.height);
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, 0, 0, cssW, cssH); // Use state cssW, cssH

    for (const cmd of stack) drawCmd(ctx, cmd); // drawCmd は useCallback なので依存配列に追加
    if (tmpRef.current) {
      const t = tmpRef.current.getContext('2d')!;
      tmpRef.current.width = tmpRef.current.width;
      t.scale(dpr, dpr);
    }
  }, [img, cssW, cssH, stack, drawCmd]); // redrawAll の依存関係

  // Image loading
  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  // Resize handler, sets cssW, cssH, and updates canvas dimensions
  const resizeAndSetCanvasDimensions = useCallback(() => {
    if (!img || !baseRef.current) return; // baseRef.current もここでチェック
    dprRef.current = window.devicePixelRatio || 1; // ここで dprRef.current を更新

    const outer = baseRef.current.parentElement?.parentElement as HTMLElement | null;
    const container = outer ?? baseRef.current.parentElement ?? document.body;
    const containerWidth = container ? container.clientWidth : 360;
    const aspect = img.height / img.width;
    const targetCssW = Math.min(containerWidth, 1000);
    const targetCssH = Math.min(Math.floor(targetCssW * aspect), Math.floor(window.innerHeight * 0.6));

    setCssW(targetCssW);
    setCssH(targetCssH);

    // Apply dimensions to canvas elements
    [baseRef.current, tmpRef.current].forEach((cvs) => {
      if (!cvs) return;
      cvs.width  = Math.floor(targetCssW * dprRef.current);
      cvs.height = Math.floor(targetCssH * dprRef.current);
      cvs.style.width  = `${targetCssW}px`;
      cvs.style.height = `${targetCssH}px`;
    });
  }, [img]); // img が変更されたときにこの関数を再作成

  // Effect for initial resize and attaching resize observers
  useEffect(() => {
    resizeAndSetCanvasDimensions(); // 初回実行
    const ro = new ResizeObserver(resizeAndSetCanvasDimensions);
    const observeTarget = baseRef.current?.parentElement?.parentElement ?? baseRef.current?.parentElement ?? undefined;
    if (observeTarget) ro.observe(observeTarget);
    window.addEventListener('resize', resizeAndSetCanvasDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resizeAndSetCanvasDimensions);
    };
  }, [resizeAndSetCanvasDimensions]); // resizeAndSetCanvasDimensions が変更されたときに再実行

  // Effect to redraw when cssW, cssH, or stack changes
  useEffect(() => {
    if (cssW && cssH) {
      redrawAll(); // Memoized redrawAll を呼び出す
    }
  }, [cssW, cssH, stack, redrawAll]); // 全ての依存関係を明示的に含める

  const ev2pt = (e: React.MouseEvent): [number, number] => {
    const rect = baseRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const drawPreview = useCallback((ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]) => {
    // 以前に修正済みの条件式
    const cmd: DrawCmd = (tool === 'pen' || tool === 'erase')
      ? { t: tool, color, width, points: [from, to] }
      : { t: tool, color, width, from, to };
    drawCmd(ctx, cmd);
  }, [tool, color, width, drawCmd]); // drawCmd も依存関係に追加

  const onDown = useCallback((e: React.MouseEvent) => {
    setDrawing(true);
    const p = ev2pt(e);
    startPos.current = p;
    penPts.current = [p];

    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, p, p);
  }, [dprRef, drawPreview]); // dprRef も依存関係に追加

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!drawing) return;
    const p = ev2pt(e);
    const t = tmpRef.current!.getContext('2d')!;
    tmpRef.current!.width = tmpRef.current!.width;
    t.scale(dprRef.current, dprRef.current);
    drawPreview(t, startPos.current!, p); // drawPreview は現在の描画を表示

    if (tool === 'pen' || tool === 'erase') {
      // ペンや消しゴムは連続的な描画なので、直接 baseRef に描画
      penPts.current.push(p);
      const ctx = baseRef.current!.getContext('2d')!;
      // drawCmd を直接呼び出す場合は、ctx のスケール設定に注意
      ctx.scale(dprRef.current, dprRef.current); // 描画前にスケールを設定
      drawCmd(ctx, { t: tool, color, width, points: [penPts.current.at(-2)!, p] });
      ctx.scale(1/dprRef.current, 1/dprRef.current); // 描画後にスケールをリセット
    }
  }, [drawing, tool, color, width, drawPreview, dprRef, drawCmd]);

  const onUp = useCallback((e: React.MouseEvent) => {
    if (!drawing) return;
    setDrawing(false);
    const p = ev2pt(e);
    const cmd: DrawCmd =
      (tool === 'pen' || tool === 'erase')
        ? { t: tool, color, width, points: penPts.current }
        : { t: tool, color, width, from: startPos.current!, to: p };
    setStack((s) => [...s, cmd]); setRedoStack([]);
    if (tmpRef.current) tmpRef.current.width = tmpRef.current.width;
  }, [drawing, tool, color, width]); // startPos.current, penPts.current は ref なので依存配列には不要

  const undo = useCallback(() => {
    setStack((s) => (s.length ? (setRedoStack(r => [...r, s[s.length-1]]), s.slice(0, -1)) : s));
  }, []); // 依存関係なし

  const redo = useCallback(() => {
    setRedoStack((r) => (r.length ? (setStack(s => [...s, r[r.length-1]]), r.slice(0, -1)) : r));
  }, []); // 依存関係なし

  const clearAll = useCallback(() => {
    setStack([]); setRedoStack([]);
  }, []); // 依存関係なし

  const exportPng = useCallback(() => {
    const url = baseRef.current!.toDataURL('image/png');
    onChange?.(url);
    const a = document.createElement('a'); a.href = url; a.download = 'snapshot-annotated.png'; a.click();
  }, [onChange]); // onChange を依存関係に追加

  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-3 text-white overflow-hidden">
      {/* ★ ツールバー右下に縦並び表示 */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
        <button title="ペン" onClick={() => setTool('pen')} className={`p-2 rounded ${tool==='pen'?'bg-white text-purple-600':'bg-white/20'}`}><Pencil size={16}/></button>
        <button title="直線" onClick={() => setTool('line')} className={`p-2 rounded ${tool==='line'?'bg-white text-purple-600':'bg-white/20'}`}><Minus size={16}/></button>
        <button title="矢印" onClick={() => setTool('arrow')} className={`p-2 rounded ${tool==='arrow'?'bg-white text-purple-600':'bg-white/20'}`}><MoveRight size={16}/></button>
        <button title="矩形" onClick={() => setTool('rect')} className={`p-2 rounded ${tool==='rect'?'bg-white text-purple-600':'bg-white/20'}`}><Square size={16}/></button>
        <button title="円" onClick={() => setTool('circle')} className={`p-2 rounded ${tool==='circle'?'bg-white text-purple-600':'bg-white/20'}`}><Circle size={16}/></button>
        <button title="消しゴム" onClick={() => setTool('erase')} className={`p-2 rounded ${tool==='erase'?'bg-white text-purple-600':'bg-white/20'}`}><Eraser size={16}/></button>
        <button title="Undo" onClick={undo} className="p-2 rounded bg-white/20"><RotateCcw size={16}/></button>
        <button title="Redo" onClick={redo} className="p-2 rounded bg-white/20"><RotateCw size={16}/></button>
        <button title="Export" onClick={exportPng} className="p-2 rounded bg-green-600"><Download size={16}/></button>
      </div>

      {/* Canvas表示領域 */}
      <div className="w-full rounded-xl overflow-hidden border border-white/10">
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
