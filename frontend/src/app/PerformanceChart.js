import React, {useEffect} from 'react';
import {createChart} from 'lightweight-charts';

export default function PerformanceChartCopy(props) {
  const ref = React.useRef();
  useEffect(() => {
    let chart = createChart(ref.current, {
      width: 800,
      height: 500,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      timeScale: {

      },
      layout: {
        backgroundColor: '#fafafa',
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
      topColor: 'rgba(76, 175, 80, 0.5)',
      lineColor: 'rgba(76, 175, 80, 1)',
      bottomColor: 'rgba(76, 175, 80, 0)',
      lineWidth: 2,
    });
    let volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceLineVisible: false,
      color: 'rgba(76, 175, 80, 0.5)',
      priceScaleId: '',
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    areaSeries.setData(props["closeData"] !== undefined ? props["closeData"] : []);
    volumeSeries.setData(props["volumeData"] !== undefined ? props["volumeData"] : []);

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