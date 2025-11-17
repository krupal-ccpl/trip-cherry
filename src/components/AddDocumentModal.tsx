import { useState, useRef } from "react";
import * as MT from "@material-tailwind/react";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (path: string) => void;
  documentName: string;
}

export default function AddDocumentModal({ isOpen, onClose, onAdd, documentName }: AddDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setError('');

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For prototyping, we'll simulate a file path
    const fakePath = `/uploads/${Date.now()}-${file.name}`;
    onAdd(fakePath);
    onClose();
    setFile(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      setFile(null);
      setError('');
      setIsDragOver(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Basic validation
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a valid file (JPEG, PNG, or PDF)');
      setFile(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'application/pdf':
        return '📄';
      case 'image/jpeg':
      case 'image/png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-gray-900 dark:text-white">
            Upload {documentName}
          </h2>
          <button
            onClick={handleClose}
            className={`w-8 h-8 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : file
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getFileIcon(file.type)} {file.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)} • Ready to upload
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isDragOver
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <CloudArrowUpIcon className={`w-6 h-6 transition-colors ${
                      isDragOver ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {isDragOver ? 'Drop your file here' : 'Choose a file or drag it here'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    JPEG, PNG, or PDF (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <MT.Button
            onClick={handleClose}
            variant="outlined"
            color="gray"
            className={`px-4 py-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Cancel
          </MT.Button>
          <MT.Button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all ${
              (!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
            } ${isUploading ? 'animate-pulse' : ''}`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </MT.Button>
        </div>
      </div>
    </div>
  );
}