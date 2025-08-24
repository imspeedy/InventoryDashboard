import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Category } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryChart: React.FC = () => {
  const { products } = useSelector((state: RootState) => state.products);
  const [chartData, setChartData] = useState<any>(null);

  // Memoize chart data to avoid unnecessary recalculations
  const chartDataMemo = useMemo(() => {
    if (products.length === 0) return null;

    const categories: Category[] = ['Electronics', 'Apparel', 'Food', 'Books', 'Home & Garden', 'Sports', 'Other'];
    
    const categoryCounts = categories.map(category => 
      products.filter(product => product.category === category).length
    );

    // Calculate percentages for better visualization
    const totalProducts = products.length;
    const categoryPercentages = categoryCounts.map(count => 
      totalProducts > 0 ? ((count / totalProducts) * 100).toFixed(1) : 0
    );

    return {
      labels: categories,
      counts: categoryCounts,
      percentages: categoryPercentages
    };
  }, [products]);

  useEffect(() => {
    if (chartDataMemo) {
      const data = {
        labels: chartDataMemo.labels,
        datasets: [
          {
            label: 'Product Count',
            data: chartDataMemo.counts,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',   // Blue
              'rgba(16, 185, 129, 0.8)',   // Green
              'rgba(245, 158, 11, 0.8)',   // Yellow
              'rgba(239, 68, 68, 0.8)',    // Red
              'rgba(139, 92, 246, 0.8)',   // Purple
              'rgba(236, 72, 153, 0.8)',   // Pink
              'rgba(107, 114, 128, 0.8)',  // Gray
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(107, 114, 128, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      };

      setChartData(data);
    }
  }, [chartDataMemo]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Products by Category',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          title: function(context: any) {
            return `Category: ${context[0].label}`;
          },
          label: function(context: any) {
            const count = context.parsed.y;
            const percentage = chartDataMemo?.percentages[context.dataIndex] || 0;
            return [
              `Products: ${count}`,
              `Percentage: ${percentage}%`
            ];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false,
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
        },
        border: {
          display: false
        }
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    }
  };

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Category Summary</h4>
        <div className="space-y-3">
          {chartData.labels.map((category: string, index: number) => {
            const count = chartData.datasets[0].data[index];
            const percentage = chartDataMemo?.percentages[index] || 0;
            const isHighest = count === Math.max(...chartData.datasets[0].data);
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{category}</span>
                  {isHighest && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Top
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Total Products */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total Products</span>
            <span className="text-lg font-bold text-blue-600">{products.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
