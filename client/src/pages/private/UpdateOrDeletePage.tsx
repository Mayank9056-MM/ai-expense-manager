import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CreditCard,
  Check,
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Trash2,
  AlertTriangle,
  Edit3,
} from 'lucide-react';
import { useExpense } from '@/context/ExpenseContext';

const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔', color: 'from-violet-500 to-purple-600' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: 'from-fuchsia-500 to-pink-600' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'from-purple-500 to-indigo-600' },
  { value: 'bills', label: 'Bills & Utilities', icon: '💡', color: 'from-green-500 to-emerald-600' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-pink-500 to-rose-600' },
  { value: 'health', label: 'Health & Fitness', icon: '💊', color: 'from-blue-500 to-cyan-600' },
  { value: 'education', label: 'Education', icon: '📚', color: 'from-yellow-500 to-orange-600' },
  { value: 'others', label: 'Others', icon: '📦', color: 'from-slate-500 to-gray-600' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'credit', label: 'Credit Card', icon: '💳' },
  { value: 'debit', label: 'Debit Card', icon: '🏧' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'wallet', label: 'Digital Wallet', icon: '👛' },
];

const UpdateOrDeletePage = () => {
  // Get action and id from URL - you'd normally use react-router's useParams
  // For demo: assumes window.location.pathname format like "/update/123" or "/delete/123"
  const getActionAndId = () => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    if (parts.length >= 2) {
      const action = parts[parts.length - 2]; // "update" or "delete"
      const id = parts[parts.length - 1]; // the ID
      return { action, id };
    }
    return { action: 'update', id: null };
  };

  const { action: initialAction, id: expenseId } = getActionAndId();
  const [action, setAction] = useState(initialAction);
  
  const { getExpenseById, updateExpense, deleteExpense } = useExpense();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch expense data on mount
  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!expenseId) {
        setError('No expense ID provided');
        setFetchingData(false);
        return;
      }

      try {
        setFetchingData(true);
        const expense = await getExpenseById(expenseId);
        
        if (expense) {
          const expenseData = {
            title: expense.title || '',
            amount: expense.amount?.toString() || '',
            category: expense.category || '',
            description: expense.description || '',
            date: expense.date || new Date().toISOString().split('T')[0],
            paymentMethod: expense.paymentMethod || '',
            notes: expense.notes || '',
          };
          setFormData(expenseData);
          setOriginalData(expenseData);
        } else {
          setError('Expense not found');
        }
      } catch (err) {
        setError('Failed to load expense data');
        console.error('Error fetching expense:', err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchExpenseData();
  }, [expenseId, getExpenseById]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateExpense(expenseId, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      setShowSuccess(true);
      setOriginalData(formData);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/'; // Or use react-router's navigate
      }, 2000);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await deleteExpense(expenseId);
      
      setShowSuccess(true);
      setShowDeleteConfirm(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/'; // Or use react-router's navigate
      }, 2000);
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResetForm = () => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
    }
  };

  const getCategoryData = (value) => {
    return CATEGORIES.find(cat => cat.value === value);
  };

  const getPaymentMethodData = (value) => {
    return PAYMENT_METHODS.find(pm => pm.value === value);
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Loading state
  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
            <p className="text-lg font-medium text-slate-700">Loading expense data...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state - no expense found
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Card className="bg-red-50 border-red-200 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-900">{error}</h2>
              <p className="text-red-700">The expense you're looking for doesn't exist or has been deleted.</p>
              <Button
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Delete Confirmation Modal
  if (action === 'delete' && showDeleteConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-4 sm:p-6 flex items-center justify-center">
        <Card className="max-w-lg w-full bg-white/95 backdrop-blur-xl p-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Expense?</h2>
              <p className="text-slate-600">This action cannot be undone. The expense will be permanently deleted.</p>
            </div>

            <Card className="w-full bg-slate-50 p-4 border-2 border-slate-200">
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Title:</span>
                  <span className="font-semibold text-slate-900">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Amount:</span>
                  <span className="font-semibold text-slate-900">₹{formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Category:</span>
                  <span className="font-semibold text-slate-900">
                    {getCategoryData(formData.category)?.icon} {getCategoryData(formData.category)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Date:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(formData.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4 w-full">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 py-3 text-base font-semibold border-2"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 text-base font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Expense
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Delete Page (before confirmation)
  if (action === 'delete' && !showDeleteConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-slate-600 hover:text-slate-900"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Delete Expense</h1>
            <p className="text-slate-600">Review the expense details before deleting</p>
          </div>

          {showSuccess && (
            <Card className="bg-green-50 border-green-200 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Expense Deleted Successfully!</h3>
                  <p className="text-sm text-green-700">Redirecting to dashboard...</p>
                </div>
              </div>
            </Card>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200 p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </Card>
          )}

          <div className="space-y-6">
            {/* Expense Details Card */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{formData.title}</h2>
                  <p className="text-slate-600">Expense Details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-slate-900">₹{formData.amount}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getCategoryData(formData.category)?.icon}</span>
                    <span className="text-xl font-bold text-slate-900">
                      {getCategoryData(formData.category)?.label}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Date</p>
                  <p className="text-xl font-bold text-slate-900">
                    {new Date(formData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPaymentMethodData(formData.paymentMethod)?.icon}</span>
                    <span className="text-xl font-bold text-slate-900">
                      {getPaymentMethodData(formData.paymentMethod)?.label || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {formData.description && (
                <div className="mt-6 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Description</p>
                  <p className="text-slate-900">{formData.description}</p>
                </div>
              )}

              {formData.notes && (
                <div className="mt-6 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Notes</p>
                  <p className="text-slate-900">{formData.notes}</p>
                </div>
              )}
            </Card>

            {/* Delete Action Button */}
            <Card className="bg-red-50 border-red-200 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">Permanent Deletion</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete this expense, it cannot be recovered. All associated data will be permanently removed from your records.
                  </p>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Proceed to Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Update Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 text-slate-600 hover:text-slate-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Update Expense</h1>
          <p className="text-slate-600">Modify your expense details</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="bg-green-50 border-green-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Expense Updated Successfully!</h3>
                <p className="text-sm text-green-700">Redirecting to dashboard...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border-red-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </Card>
        )}

        {/* Changes Indicator */}
        {hasChanges() && (
          <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700">You have unsaved changes</p>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {/* Title Input */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Title</h3>
                <p className="text-sm text-slate-600">Give your expense a name</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Grocery Shopping"
              className={`w-full px-4 py-3 text-lg bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                errors.title ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </Card>

          {/* Amount Input */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Amount</h3>
                <p className="text-sm text-slate-600">How much did you spend?</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-4 text-2xl font-bold bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                  errors.amount ? 'border-red-300' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
            )}
          </Card>

          {/* Category Selection */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Category</h3>
                <p className="text-sm text-slate-600">What type of expense is this?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleChange('category', category.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === category.value
                      ? 'border-violet-500 bg-violet-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <p className="text-sm font-medium text-slate-900">{category.label}</p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </Card>

          {/* Date */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Date</h3>
                <p className="text-sm text-slate-600">When did this expense occur?</p>
              </div>
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                errors.date ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">{errors.date}</p>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Payment Method</h3>
                <p className="text-sm text-slate-600">How did you pay?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handleChange('paymentMethod', method.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.paymentMethod === method.value
                      ? 'border-violet-500 bg-violet-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <p className="text-xs font-medium text-slate-900">{method.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Notes</h3>
                <p className="text-sm text-slate-600">Additional details about this expense</p>
              </div>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any extra details here..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUpdate}
              disabled={loading || !hasChanges()}
              className="flex-1 py-6 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Update Expense
                </>
              )}
            </Button>
            <Button
              onClick={handleResetForm}
              disabled={!hasChanges()}
              variant="outline"
              className="sm:w-auto py-6 text-lg font-semibold border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
          </div>
        </div>

        {/* Quick Summary */}
        {formData.amount && formData.category && (
          <Card className="mt-6 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white p-6">
            <h3 className="font-semibold mb-3">Updated Expense Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-white/80">Amount</p>
                <p className="text-xl font-bold">₹{formData.amount || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-white/80">Category</p>
                <p className="text-xl font-bold">
                  {getCategoryData(formData.category)?.icon || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80">Payment</p>
                <p className="text-xl font-bold">
                  {getPaymentMethodData(formData.paymentMethod)?.icon || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/80">Date</p>
                <p className="text-xl font-bold">
                  {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
            {hasChanges() && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/90 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Changes detected - don't forget to save!
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default UpdateOrDeletePage;