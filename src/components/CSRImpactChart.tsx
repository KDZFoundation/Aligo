import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CSRImpactChartProps {
  projects: Project[];
}

export default function CSRImpactChart({ projects }: CSRImpactChartProps) {
  const { t, language } = useLanguage();

  const environmentalCount = projects.filter(p => ['Ekologia', 'Środowisko', 'Zwierzęta', 'Ecology'].includes((p.category || '') as string)).length;
  const socialCount = projects.filter(p => ['Zdrowie', 'Pomoc Społeczna', 'Kultura', 'Edukacja', 'Health', 'Social Help', 'Culture', 'Education'].includes((p.category || '') as string)).length;
  const employeeCount = projects.filter(p => 
    (p.title?.toLowerCase().includes('warsztat') || p.title?.toLowerCase().includes('workshop') || p.effect?.toLowerCase().includes('pracowni') || (p.category as string) === 'Edukacja' || (p.category as string) === 'Education')
  ).length;

  const data = [
    { name: t('chart.environment', 'Środowisko', 'Environment'), value: environmentalCount, color: '#10b981' },
    { name: t('chart.society', 'Społeczeństwo', 'Society'), value: socialCount, color: '#3b82f6' },
    { name: t('chart.employees', 'Pracownicy', 'Employees'), value: employeeCount, color: '#8b5cf6' },
  ];

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 0, 0]}
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
