import React, {useEffect} from 'react';
import {createChart} from 'lightweight-charts';

export const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function PerformanceChart(props) {
  const ref = React.useRef();
  useEffect(() => {
    let chart = createChart(ref.current, {
      width: 800,
      height: 500,
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      timeScale: {
        tickMarkFormatter: (time) => {
          const date = new Date(time.year, time.month, time.day);
          if (date.toString() !== 'Invalid Date') {
            return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
          } else {
            const utcTime = new Date(time * 1000).toUTCString();
            let utcSplit = utcTime.split(' '); // extract time
            return utcSplit[4]
          }
        },
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
    let volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceLineVisible: false,
      color: 'rgba(80,178,182,0.75)',
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
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