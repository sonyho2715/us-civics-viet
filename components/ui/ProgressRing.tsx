'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

export function ProgressRing({
  progress,
  size = 'md',
  strokeWidth = 4,
  showPercentage = true,
  className,
  color = 'blue',
}: ProgressRingProps) {
  const sizes = {
    sm: 48,
    md: 64,
    lg: 96,
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  const colors = {
    blue: 'text-blue-800',
    green: 'text-green-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
  };

  const strokeColors = {
    blue: 'stroke-blue-800',
    green: 'stroke-green-500',
    amber: 'stroke-amber-500',
    red: 'stroke-red-500',
  };

  const dimension = sizes[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: dimension, height: dimension }}
    >
      <svg
        className="transform -rotate-90"
        width={dimension}
        height={dimension}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn('transition-all duration-500 ease-out', strokeColors[color])}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showPercentage && (
        <span
          className={cn(
            'absolute font-semibold',
            textSizes[size],
            colors[color]
          )}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
