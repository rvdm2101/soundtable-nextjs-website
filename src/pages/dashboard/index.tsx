import { getTopTracks } from '@/utils/spotify/getTopTracks';
import { useEffect, useState } from 'react';
import BubbleChart from '@/components/Chart/BubbleChart';
import { SVG_WIDTH, SVG_HEIGHT, BUBBLE_RADIUS } from '@/components/Chart/useBubbleChart';
import type { BubbleChartData } from '@/components/Chart/useBubbleChart';
import * as d3 from 'd3';
import { fitTextToCircle } from '@/components/Chart/helperFunctions';

export default function Dashboard() {
  const [data, setData] = useState<BubbleChartData[]>([]);

  useEffect(() => {
    const step = BUBBLE_RADIUS * 2;
    const theta = Math.PI * (3 - Math.sqrt(5));

    getTopTracks(50).then((tracks) => {
      setData(
        tracks.map((track, i) => {
          const updatedI = i + 0.5;
          const dataRadius = step * Math.sqrt(updatedI);
          const a = theta * updatedI;
          return {
            x: SVG_WIDTH / 2 + dataRadius * Math.cos(a),
            y: SVG_HEIGHT / 2 + dataRadius * Math.sin(a),
            color: d3.interpolateRainbow(i / 360),
            title: fitTextToCircle(track.name)
          };
        })
      );
    });
  }, []);

  return (
    <main className="main">
      <p>Dashboard, logged in using spotify</p>
      <BubbleChart data={data} />
    </main>
  );
}
