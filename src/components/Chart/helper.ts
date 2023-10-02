// import * as d3 from 'd3';
// import { BubbleChartData } from '@/components/Chart/BubbleChart';
//
// export function wrap(textElement: d3.Selection<SVGTextElement, BubbleChartData, SVGGElement, unknown>, width: number) {
//   textElement.each(function () {
//     const text = d3.select(this);
//     const words = text.text().split(/\s+/).reverse();
//     let word;
//     let line: any[] = [];
//     let lineNumber = 0;
//     const lineHeight = 1.1; // ems
//     const x = text.attr('x');
//     const y = text.attr('y');
//     const dy = 0; // parseFloat(text.attr("dy")),
//     let tspan = text.text(null)
//       .append('tspan')
//       .attr('x', x)
//       .attr('y', y)
//       .attr('dy', `${dy}em`);
//     while (word = words.pop()) {
//       line.push(word);
//       tspan.text(line.join(' '));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(' '));
//         line = [word];
//         tspan = text.append('tspan')
//           .attr('x', x)
//           .attr('y', y)
//           .attr('dy', `${++lineNumber * lineHeight + dy}em`)
//           .text(word);
//       }
//     }
//   });
// }
