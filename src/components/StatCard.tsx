import React from 'react';
import Card from './ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'text-eco-primary bg-green-50',
    secondary: 'text-eco-secondary bg-blue-50',
    accent: 'text-eco-accent bg-yellow-50',
    success: 'text-green-600 bg-green-50'
  };

  return (
    <Card className="dashboard-card hover:shadow-eco-lg transition-eco cursor-pointer">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs sm:text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
