import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const dummyData = {
    data: [
        { createdAt: '2025-01-07T05:19:04.537+00:00', funds: 4000 },
        { createdAt: '2025-04-14T05:19:04.537+00:00', funds: 3000 },
        { createdAt: '2025-05-15T05:19:04.537+00:00', funds: 2000 },
        { createdAt: '2025-06-07T05:19:04.537+00:00', funds: 2780 },
        { createdAt: '2025-07-03T05:19:04.537+00:00', funds: 1890 },
        { createdAt: '2025-08-05T05:19:04.537+00:00', funds: 2390 },
        { createdAt: '2024-03-07T05:19:04.537+00:00', funds: 3490 },
        { createdAt: '2024-03-08T05:19:04.537+00:00', funds: 4300 },
        { createdAt: '2025-09-09T05:19:04.537+00:00', funds: 2100 },
        { createdAt: '2025-12-20T05:19:04.537+00:00', funds: 3100 },
        { createdAt: '2024-01-28T05:19:04.537+00:00', funds: 4500 },
        { createdAt: '2025-03-07T05:19:04.537+00:00', funds: 3700 }
    ]
};

// Format data based on range and selected year
const formatData = (range: 'yearly' | 'monthly' | 'weekly' | 'daily', year: string) => {
    const groupedData: Record<string, number> = {};

    dummyData.data.forEach(item => {
        const date = new Date(item.createdAt);
        const itemYear = date.getFullYear().toString();

        if (year !== 'all' && itemYear !== year) return; // Filter by selected year

        let key = '';
        if (range === 'yearly') {
            key = itemYear; // Year format
        } else if (range === 'monthly') {
            key = `${itemYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
        } else if (range === 'weekly') {
            const week = Math.ceil(date.getDate() / 7);
            key = `${itemYear}-W${week}`; // YYYY-WXX
        } else if (range === 'daily') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        }

        groupedData[key] = (groupedData[key] || 0) + item.funds;
    });

    return Object.entries(groupedData).map(([key, funds]) => ({ date: key, funds }));
};

const FundsGraph: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<'yearly' | 'monthly' | 'weekly' | 'daily'>('yearly');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    const availableYears = useMemo(() => {
        const years = new Set(dummyData.data.map(item => new Date(item.createdAt).getFullYear().toString()));
        return Array.from(years).sort();
    }, []);

    const processedData = useMemo(() => formatData(selectedRange, selectedYear), [selectedRange, selectedYear]);

    return (
        <div className='px-4 py-6 border border-gray-200 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>Funds Raised Over Time</h2>

                <div className='flex items-center gap-4'>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className='border border-gray-300 rounded px-3 py-1'
                    >
                        <option value="all">All Years</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value as 'yearly' | 'monthly' | 'weekly' | 'daily')}
                        className='border border-gray-300 rounded px-3 py-1'
                    >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="funds" stroke="#4CAF50" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FundsGraph;
