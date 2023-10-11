import { useBubbleChart } from '@/components/Chart/useBubbleChart';
import type { BubbleChartData } from '@/components/Chart/useBubbleChart';

interface BubbleChartProps {
  data: BubbleChartData[];
}

function BubbleChart({ data }: BubbleChartProps) {
  const {
    ref,
    zoomIn,
    zoomOut,
    zoomRandom,
    zoomReset,
  } = useBubbleChart(data);

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
