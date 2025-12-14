import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Coffee,
  Home as HomeIcon,
  Car,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { useExpense } from '@/context/ExpenseContext';

// Mock data for charts
// const monthlyExpenseData = [
//   { month: 'Jan', amount: 4200, budget: 5000 },
//   { month: 'Feb', amount: 3800, budget: 5000 },
//   { month: 'Mar', amount: 5200, budget: 5000 },
//   { month: 'Apr', amount: 4600, budget: 5000 },
//   { month: 'May', amount: 5800, budget: 5000 },
//   { month: 'Jun', amount: 4900, budget: 5000 },
//   { month: 'Jul', amount: 5300, budget: 5000 },
//   { month: 'Aug', amount: 4700, budget: 5000 },
//   { month: 'Sep', amount: 5100, budget: 5000 },
//   { month: 'Oct', amount: 5600, budget: 5000 },
//   { month: 'Nov', amount: 5400, budget: 5000 },
//   { month: 'Dec', amount: 6200, budget: 5000 },
// ];

// const categoryData = [
//   { name: 'Food & Dining', value: 1850, color: '#8b5cf6' },
//   { name: 'Transport', value: 980, color: '#ec4899' },
//   { name: 'Shopping', value: 1450, color: '#f59e0b' },
//   { name: 'Bills & Utilities', value: 2100, color: '#10b981' },
//   { name: 'Entertainment', value: 620, color: '#6366f1' },
//   { name: 'Others', value: 800, color: '#8b5cf6' },
// ];

// const weeklyData = [
//   { day: 'Mon', amount: 145 },
//   { day: 'Tue', amount: 230 },
//   { day: 'Wed', amount: 180 },
//   { day: 'Thu', amount: 290 },
//   { day: 'Fri', amount: 320 },
//   { day: 'Sat', amount: 450 },
//   { day: 'Sun', amount: 280 },
// ];


const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
    const {
    expenses,
    monthlySummary,
    categorySummary,
    loading,
    error,
  } = useExpense();

  // Calculate statistics
 const totalExpenses = monthlySummary?.totalExpenses ?? 0;
  const monthlyBudget = monthlySummary?.budget ?? 0;
  const savingsRate = monthlySummary?.savingsRate ?? 0;
  const monthlyExpenseData = monthlySummary?.chartData ?? [];
const weeklyData = monthlySummary?.weeklyData ?? [];
const categoryData = categorySummary ?? [];



  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{value}</h3>
          <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
            <span className="text-slate-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          trend === 'up' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-semibold text-slate-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-slate-600">
              <span className="font-medium">{entry.name}:</span> ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Track your expenses and financial insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            className={timeRange === 'week' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : ''}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            className={timeRange === 'month' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : ''}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            onClick={() => setTimeRange('year')}
            className={timeRange === 'year' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : ''}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Expenses"
           value={`₹${totalExpenses}`}
          change={monthlySummary?.change ?? 0}
          icon={DollarSign}
         trend={totalExpenses > monthlyBudget ? "down" : "up"}
        />
        <StatCard
          title="Monthly Budget"
          value={`$${monthlyBudget.toLocaleString()}`}
          change={5.2}
          icon={Calendar}
          trend="up"
        />
        <StatCard
          title="Budget Remaining"
          value={`$${(monthlyBudget - totalExpenses).toLocaleString()}`}
          change={3.1}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          change={2.4}
          icon={TrendingDown}
          trend="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Monthly Expense Trend */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Monthly Expense Trend</h3>
              <p className="text-sm text-slate-600">Your spending patterns over time</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyExpenseData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
                name="Expenses"
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorBudget)"
                name="Budget"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">By Category</h3>
              <p className="text-sm text-slate-600">Spending distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySummary}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((category, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="text-slate-600">{category.name}</span>
                </div>
                <span className="font-semibold text-slate-900">${category.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Weekly Overview */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Weekly Overview</h3>
              <p className="text-sm text-slate-600">Daily spending this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} name="Amount" />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent</h3>
              <p className="text-sm text-slate-600">Latest transactions</p>
            </div>
          </div>
          <div className="space-y-4">
            {expenses?.slice(0,5).map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center flex-shrink-0">
                  <transaction.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{transaction.name}</p>
                  <p className="text-xs text-slate-500">{transaction.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900">-${transaction.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-violet-600 hover:text-fuchsia-600">
            View All Transactions
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <h4 className="font-semibold mb-1">Add Expense</h4>
          <p className="text-sm text-white/80">Quick entry</p>
        </Card>
        <Card className="bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h4 className="font-semibold mb-1">Scan Receipt</h4>
          <p className="text-sm text-white/80">Auto-detect</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="font-semibold mb-1">Set Budget</h4>
          <p className="text-sm text-white/80">Plan ahead</p>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-semibold mb-1">View Reports</h4>
          <p className="text-sm text-white/80">Detailed analysis</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;