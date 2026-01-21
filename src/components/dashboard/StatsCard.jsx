import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  const hasChange = change !== undefined && change !== null;

  return (
    <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-md hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-100 opacity-90">{title}</p>
          <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
        </div>
        
        {Icon && (
          <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Icon className="w-5 h-5 text-black" />
          </div>
        )}
      </div>
      
      {/* {hasChange && (
        <div className="flex items-center mt-4 pt-3 border-t border-white border-opacity-20">
          <span className={`flex items-center text-sm font-semibold ${
            isPositive ? 'text-white' : 'text-orange-100'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-orange-100 ml-2 opacity-80">from last period</span>
        </div>
      )} */}
      
      {/* {!hasChange && (
        <div className="flex items-center mt-4 pt-3 border-t border-white border-opacity-20">
          <TrendingUp className="w-4 h-4 mr-2 text-orange-100 opacity-80" />
          <span className="text-sm text-orange-100 opacity-80">Current total</span>
        </div>
      )} */}
    </div>
  );
};

export default StatsCard;