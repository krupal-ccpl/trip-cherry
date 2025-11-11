import { useState } from "react";
import * as MT from "@material-tailwind/react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: { amount: number; method: 'cash' | 'online'; date: string; timestamp: string }) => void;
  maxAmount: number;
  currentCollected: number;
}

export default function PaymentModal({ isOpen, onClose, onAdd, maxAmount, currentCollected }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'online'>('cash');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount > maxAmount - currentCollected) {
      setError(`Amount cannot exceed ₹${(maxAmount - currentCollected).toLocaleString()}`);
      return;
    }

    const now = new Date();
    const payment = {
      amount: numAmount,
      method,
      date: now.toLocaleDateString('en-IN'),
      timestamp: now.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    onAdd(payment);
    onClose();
    setAmount('');
    setMethod('cash');
    setError('');
  };

  const handleClose = () => {
    onClose();
    setAmount('');
    setMethod('cash');
    setError('');
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-blue-gray-900 dark:text-white">Add Payment</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (₹)
              </label>
              <MT.Input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                onKeyDown={handleNumberInput}
                min="0"
                max={(maxAmount - currentCollected).toString()}
                placeholder="Enter amount"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum allowed: ₹{(maxAmount - currentCollected).toLocaleString()}
              </p>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cash"
                    checked={method === 'cash'}
                    onChange={(e) => setMethod(e.target.value as 'cash' | 'online')}
                    className="mr-2"
                  />
                  <span className="text-sm">Cash</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="online"
                    checked={method === 'online'}
                    onChange={(e) => setMethod(e.target.value as 'cash' | 'online')}
                    className="mr-2"
                  />
                  <span className="text-sm">Online</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <MT.Button
              onClick={handleClose}
              variant="outlined"
              color="gray"
              className="px-4 py-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Cancel
            </MT.Button>
            <MT.Button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Add Payment
            </MT.Button>
          </div>
        </div>
      </div>
    )
  );
}