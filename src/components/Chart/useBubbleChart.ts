import type { MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as d3 from 'd3';

const MAX_ZOOM_LEVEL = 40;
export const SVG_WIDTH = 500;
export const SVG_HEIGHT = 500;
export const BUBBLE_RADIUS = 6;

export type BubbleChartData = {
  x: number,
  y: number,
  color: string,
  title: string,
};

interface IUseBubbleChart {
  ref: MutableRefObject<null>;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomRandom: () => void;
  zoomReset: () => void;
}

export const useBubbleChart = (data: BubbleChartData[]): IUseBubbleChart => {
  const ref = useRef(null);
  const [zoomIn, setZoomIn] = useState<() => void>(() => {});
  const [zoomOut, setZoomOut] = useState<() => void>(() => {});
  const [zoomRandom, setZoomRandom] = useState<() => void>(() => {});
  const [zoomReset, setZoomReset] = useState<() => void>(() => {});

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('g').remove();
    const g = svg.append('g');

    function zoomed({ transform }: { transform: any }) {
      g.attr('transform', transform);
    }

    const zoom = d3.zoom()
      .scaleExtent([1, MAX_ZOOM_LEVEL])
      .on('zoom', zoomed);

    function random() {
      const dataElement = data[Math.floor(Math.random() * data.length)];
      svg.transition().duration(2500).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(SVG_WIDTH / 2, SVG_HEIGHT / 2).scale(MAX_ZOOM_LEVEL).translate(-dataElement.x, -dataElement.y),
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
        d3.zoomTransform(node).invert([SVG_WIDTH / 2, SVG_HEIGHT / 2]),
      );
    }

    function clicked(event: any, dataElement: BubbleChartData) {
      event.stopPropagation();
      const svgNode = svg.node();
      let currentSvgZoomScale = 1;
      if (svgNode) {
        currentSvgZoomScale = d3.zoomTransform(svgNode).k;
      }

      if (currentSvgZoomScale === MAX_ZOOM_LEVEL) {
        reset();
        return;
      }
      svg.transition().duration(750).call(
        // @ts-ignore
        zoom.transform,
        d3.zoomIdentity.translate(SVG_WIDTH / 2, SVG_HEIGHT / 2).scale(MAX_ZOOM_LEVEL).translate(-dataElement.x, -dataElement.y),
        d3.pointer(event),
      );
    }

    svg.attr('viewBox', [0, 0, SVG_WIDTH, SVG_HEIGHT]);
    svg.on('click', reset);

    const circles = g.selectAll('circle')
      .data(data)
      .enter()
      .append('g');

    circles.append('circle')
      .attr('cx', (dataElement) => dataElement.x)
      .attr('cy', (dataElement) => dataElement.y)
      .attr('r', BUBBLE_RADIUS)
      .attr('fill', (d) => d.color)
      .on('click', clicked);

    circles.append('text')
      .attr('x', (dataElement) => dataElement.x - BUBBLE_RADIUS + 1)
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

  return {
    ref,
    zoomIn,
    zoomOut,
    zoomRandom,
    zoomReset,
  };
};
