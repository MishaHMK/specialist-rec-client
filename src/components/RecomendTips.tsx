import React from 'react';

interface RecomendTipsProps {
  data: any; 
}

export const RecomendTips: React.FC<RecomendTipsProps> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  const tips: string[] = data.split('\n').filter((tip: string) => tip.trim() !== '');

  return (
    <div>
    <ul>
      {tips.map((tip: string, index: number) => (
        <p key={index}>{tip}</p>
      ))}
    </ul>
  </div>
  );
};