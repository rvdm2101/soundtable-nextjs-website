import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

export type BubbleChartData = {
  x: number,
  y: number,
  radius: number,
  color: string,
  title: string,
};

interface BubbleChartProps {
  data: BubbleChartData[];
}

function BubbleChart({ data }: BubbleChartProps) {
  const ref = useRef(null);
  const [zoomIn, setZoomIn] = useState<() => void>(() => {});
  const [zoomOut, setZoomOut] = useState<() => void>(() => {});
  const [zoomRandom, setZoomRandom] = useState<() => void>(() => {});
  const [zoomReset, setZoomReset] = useState<() => void>(() => {});

  useEffect(() => {
    const height = 500;
    const width = 500;
    const radius = 6;

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
      const dataElement = data[Math.floor(Math.random() * data.length)];
      svg.transition().duration(2500).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-dataElement.x, -dataElement.y),
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

    function clicked(event: any, dataElement: BubbleChartData) {
      event.stopPropagation();
      const svgNode = svg.node();
      let currentSvgZoomScale = 1;
      if (svgNode) {
        currentSvgZoomScale = d3.zoomTransform(svgNode).k;
      }

      if (currentSvgZoomScale > 1) {
        reset();
        return;
      }
      svg.transition().duration(750).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-dataElement.x, -dataElement.y),
        d3.pointer(event),
      );
    }

    svg.attr('viewBox', [0, 0, width, height]);
    svg.on('click', reset);

    const circles = g.selectAll('circle')
      .data(data)
      .enter()
      .append('g');

    circles.append('circle')
      .attr('cx', (dataElement) => dataElement.x)
      .attr('cy', (dataElement) => dataElement.y)
      .attr('r', radius)
      .attr('fill', (d) => d.color)
      .on('click', clicked);

    circles.append('text')
      .attr('x', (dataElement) => dataElement.x - radius + 1)
      .attr('y', (dataElement) => dataElement.y)
      .attr('dy', '.35em')
      .attr('class', 'bubbleTitle')
      .text((dataElement) => dataElement.title);

    // @ts-ignore
    svg.call(zoom);

    // @ts-ignore
    setZoomIn(() => svg.transition().call(zoom.scaleBy, 2));
    // @ts-ignore
    setZoomOut(() => svg.transition().call(zoom.scaleBy, 0.5));
    setZoomRandom(() => random);
    setZoomReset(() => reset);
  }, [data]);

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
