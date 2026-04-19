import '../App.css'
import { useRef, useEffect } from 'react';
import {LineChart,AreaChart,ComposedChart,Line,Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,ReferenceLine,ReferenceArea,} from 'recharts'

export default function Graph( {
    data
} ) {   
    return (<>

        <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="interpolationBinary" stroke="#4A90D9" strokeWidth={2} type="monotone" dot={false} />
            <Line dataKey="interpolationFibonacci" stroke="#52c48a" strokeWidth={2} type="monotone" dot={false} />
            <Line dataKey="interpolationExponential" stroke="#52348a" strokeWidth={2} type="monotone" dot={false} />
        </LineChart>
        </ResponsiveContainer>

    </>)
}