import '../App.css'
import { useState } from 'react';
import { LineChart,AreaChart,ComposedChart,Line,Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,ReferenceLine,ReferenceArea } from 'recharts'

export default function Graph( {
    data
} ) {   

    const PLACE_HOLDER = {
                interpolationBinary: "-",
                interpolationFibonacci: "-",
                interpolationExponential: "-"
    }

    const [activeData, setActiveData] = useState(PLACE_HOLDER)

    return (<>
    

        <ResponsiveContainer width="100%" height={300}>
            <LineChart 
                data={data} 
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }} 
                onMouseMove={(e) => {
                    if (e && e.activeIndex !== undefined) {
                        const index = parseInt(e.activeIndex)
                        setActiveData(data[index]) // ✅ grab directly from data array
                    }
                    }}
                onMouseLeave={() => setActiveData(PLACE_HOLDER)}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" />
                <YAxis tick={{ fontSize: '10px', fill: '#6b7280' }}  width={25}/>
                <Tooltip content={() => null} />
                <Legend 
                    layout="horizontal"    // wrap horizontally
                    verticalAlign="bottom" // place at bottom
                    align="start"         // center align
                    wrapperStyle={{ fontSize: '10px' }} // smaller text on mobile
                    iconType="square"
                    iconSize={10}
                />
                <Line name="Interpolation-Binary" dataKey="interpolationBinary" stroke="#4A90D9" strokeWidth={2} type="monotone" dot={false} />
                <Line name="Interpolation-Fibonacci" dataKey="interpolationFibonacci" stroke="#52c48a" strokeWidth={2} type="monotone" dot={false} />
                <Line name="Interpolation-Exponential" dataKey="interpolationExponential" stroke="#52348a" strokeWidth={2} type="monotone" dot={false}/>
            </LineChart>
        
        </ResponsiveContainer>
        
        {/* Metrics of each algorithms */}
        {activeData && (
            <div className='d-flex gap-3 mt-2 flex-column flex-lg-row'>
                <div style={{ fontSize: '10px' }}>
                <span style={{ color: '#4A90D9' }}>Interpolation-Binary: {typeof activeData.interpolationBinary === 'string' ? "-" : activeData.interpolationBinary?.toFixed(2)} ns</span>
                </div>
                <div style={{ fontSize: '10px' }}>
                <span style={{ color: '#52c48a' }}>Interpolation-Fibonacci: {typeof activeData.interpolationFibonacci === 'string' ? "-" : activeData.interpolationFibonacci?.toFixed(2)} ns</span>
                </div>
                <div style={{ fontSize: '10px' }}>
                <span style={{ color: '#52348a' }}>Interpolation-Exponential: {typeof activeData.interpolationExponential === 'string' ? "-" : activeData.interpolationExponential?.toFixed(2)} ns</span>
                </div>
            </div>
        )}

    </>)
}
