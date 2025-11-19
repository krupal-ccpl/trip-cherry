import { useRef, useEffect, useState } from "react";
import * as MT from "@material-tailwind/react";
import { ClockIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface PaymentHistory {
  amount: number;
  method: 'cash' | 'online';
  date: string;
  timestamp: string;
}

interface HistoryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  history: PaymentHistory[];
  onEdit?: (index: number, newPayment: PaymentHistory) => void;
}

export default function HistoryPopover({ isOpen, onClose, history, onEdit }: HistoryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ amount: number; method: 'cash' | 'online' }>({ amount: 0, method: 'cash' });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValues({ amount: history[index].amount, method: history[index].method });
  };

  const saveEdit = () => {
    if (editingIndex !== null && onEdit) {
      const now = new Date();
      const newPayment: PaymentHistory = {
        ...editValues,
        date: now.toISOString().split('T')[0],
        timestamp: now.toLocaleString(),
      };
      onEdit(editingIndex, newPayment);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={popoverRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-gray-900 dark:text-white">Payment History</h2>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <MT.Typography className="text-gray-500 dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              No payment history available
            </MT.Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {editingIndex === index ? (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValues.amount}
                        onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                      />
                      <select
                        value={editValues.method}
                        onChange={(e) => setEditValues({ ...editValues, method: e.target.value as 'cash' | 'online' })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon
                        className="h-4 w-4 text-green-600 cursor-pointer"
                        onClick={saveEdit}
                      />
                      <XMarkIcon
                        className="h-4 w-4 text-red-600 cursor-pointer"
                        onClick={cancelEdit}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MT.Typography className="font-semibold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{payment.amount.toLocaleString()}
                      </MT.Typography>
                      <MT.Chip
                        size="sm"
                        value={payment.method}
                        color={payment.method === 'cash' ? 'green' : 'blue'}
                        className="text-xs"
                      />
                    </div>
                    <MT.Typography className="text-xs text-gray-600 dark:text-gray-400 mt-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      {payment.timestamp}
                    </MT.Typography>
                  </div>
                )}
                {editingIndex !== index && (
                  <PencilIcon
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={() => startEditing(index)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <MT.Button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Close
          </MT.Button>
        </div>
      </div>
    </div>
  );
}