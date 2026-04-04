import '../App.css'
import { useRef, useEffect } from 'react';
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

export default function Graph( {
    data
    // x,
    // y
} ) {
    const chartRef = useRef(null);  
    const chartInstance = useRef(null);  
    
    
    useEffect(() => {
        if (chartRef.current && !chartInstance.current) {
            const opts = {
                width: chartRef.current.offsetWidth,   
                height: 400,
                series: [
                {},
                {
                    label: "Interpolation",
                    stroke: "red",
                    width: 2,
                },
                {
                    label: sessionStorage.getItem("selectedAlgo"),
                    stroke: "blue",
                    width: 2,
                }
                ],
                axes: [{
                    show: true,      // keep axis line if you want
                    grid: { show: true },
                    values: () => [],
                }, {}],
            };
    
            chartInstance.current = new uPlot(opts, data, chartRef.current);
        }
    
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };

    }, []);
    
    return (<>
        <div ref={chartRef} >
    
        </div>            
    </>)
}