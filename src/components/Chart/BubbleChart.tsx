import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

function BubbleChart() {
  const ref = useRef(null);
  const [zoomIn, setZoomIn] = useState<() => void>(() => {});
  const [zoomOut, setZoomOut] = useState<() => void>(() => {});
  const [zoomRandom, setZoomRandom] = useState<() => void>(() => {});
  const [zoomReset, setZoomReset] = useState<() => void>(() => {});

  useEffect(() => {
    const height = 500;
    const width = 500;
    const radius = 6;
    const step = radius * 2;
    const theta = Math.PI * (3 - Math.sqrt(5));

    const data = Array.from({ length: 2000 }, (_, i) => {
      const updatedI = i + 0.5;
      const dataRadius = step * Math.sqrt(updatedI);
      const a = theta * updatedI;
      return [
        width / 2 + dataRadius * Math.cos(a),
        height / 2 + dataRadius * Math.sin(a),
      ];
    });

    const svg = d3.select(ref.current);
    svg.selectAll('g').remove();
    const g = svg.append('g');

    function zoomed({ transform }: { transform: any }) {
      g.attr('transform', transform);
    }

    const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .on('zoom', zoomed);

    function random() {
      const [x, y] = data[Math.floor(Math.random() * data.length)];
      svg.transition().duration(2500).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-x, -y),
      );
    }

    function reset() {
      const node = svg.node();
      if (!node) {
        return;
      }
      svg.transition().duration(750).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(node).invert([width / 2, height / 2]),
      );
    }

    function clicked(event: any, [x, y]: any[]) {
      event.stopPropagation();
      svg.transition().duration(750).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-x, -y),
        d3.pointer(event),
      );
    }

    svg.attr('viewBox', [0, 0, width, height]);
    svg.on('click', reset);

    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', ([x]) => x)
      .attr('cy', ([, y]) => y)
      .attr('r', radius)
      .attr('fill', (d, i) => d3.interpolateRainbow(i / 360))
      .on('click', clicked);

    // @ts-ignore
    svg.call(zoom);

    // @ts-ignore
    setZoomIn(() => svg.transition().call(zoom.scaleBy, 2));
    // @ts-ignore
    setZoomOut(() => svg.transition().call(zoom.scaleBy, 0.5));
    setZoomRandom(() => random);
    setZoomReset(() => reset);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <button type="button" onClick={() => zoomIn()}>Zoom in</button>
        <button type="button" onClick={() => zoomOut()}>Zoom out</button>
        <button type="button" onClick={() => zoomRandom()}>Random</button>
        <button type="button" onClick={() => zoomReset()}>Reset</button>
      </div>
      <svg width={800} height={500} ref={ref} />
    </div>
  );
}
export default BubbleChart;
