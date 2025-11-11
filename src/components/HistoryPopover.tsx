import { useRef, useEffect } from "react";
import * as MT from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";

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
}

export default function HistoryPopover({ isOpen, onClose, history }: HistoryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

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