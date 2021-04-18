import React, {useEffect} from 'react';
import {createChart} from 'lightweight-charts';

export default function PerformanceChartCopy(props) {
  const ref = React.useRef();
  useEffect(() => {
    let chart = createChart(ref.current, {
      width: 800,
      height: 400,
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      layout: {
        backgroundColor: '#fff',
      },
      grid: {
        vertLines: {
          color: '#fff',
        },
        horzLines: {
          color: '#fff',
        },
      },
    });

    let areaSeries = chart.addAreaSeries({
      topColor: 'rgba(38,198,218, 0.56)',
      bottomColor: 'rgba(38,198,218, 0.04)',
      lineColor: 'rgba(38,198,218, 1)',
      lineWidth: 2
    });

    let extraSeries = chart.addAreaSeries({
      topColor: 'rgba(251, 192, 45, 0.56)',
      bottomColor: 'rgba(251, 192, 45, 0.04)',
      lineColor: 'rgba(251, 192, 45, 1)',
      lineWidth: 2,
    });

    areaSeries.setData(props["closeData"] !== undefined ? props["closeData"] : []);
    extraSeries.setData(props["predictionData"] !== undefined ? props["predictionData"] : []);

    chart.timeScale().fitContent();

    return () => {
      chart.remove()
    }
  }, [props]);
  return (
    <>
      <div ref={ref}/>
    </>
  );
}