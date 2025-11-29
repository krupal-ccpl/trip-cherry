import { useState } from "react";
import * as MT from "@material-tailwind/react";
import {
  XMarkIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Document {
  name: string;
  uploaded: boolean;
  path?: string;
}

interface Guest {
  guestName: string;
  documents: Document[];
}

interface FolderDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  folderKey: string;
  guests: Guest[];
  onUpdateGuests: (updatedGuests: Guest[]) => void;
  bookingType: string;
}

export default function FolderDocumentsModal({
  isOpen,
  onClose,
  folderName,
  folderKey,
  guests,
  onUpdateGuests,
  bookingType,
}: FolderDocumentsModalProps) {
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkUploadFiles, setBulkUploadFiles] = useState<FileList | null>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  // Get documents for this folder from all guests
  const getGuestDocuments = () => {
    return guests.map((guest, index) => {
      const doc = guest.documents.find(
        (d) => d.name.toLowerCase().includes(folderKey.toLowerCase())
      );
      return {
        guestIndex: index,
        guestName: guest.guestName,
        document: doc || null,
      };
    });
  };

  const guestDocuments = getGuestDocuments();
  const uploadedCount = guestDocuments.filter((g) => g.document?.uploaded).length;
  const totalCount = guests.length;
  const percentage = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

  const handleFileSelect = (guestIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadingFor(guestIndex);
    }
  };

  const handleUpload = (guestIndex: number) => {
    if (!selectedFile) return;

    // Simulate upload
    const updatedGuests = guests.map((guest, index) => {
      if (index === guestIndex) {
        const docIndex = guest.documents.findIndex(
          (d) => d.name.toLowerCase().includes(folderKey.toLowerCase())
        );

        if (docIndex !== -1) {
          // Update existing document
          const updatedDocs = [...guest.documents];
          updatedDocs[docIndex] = {
            ...updatedDocs[docIndex],
            uploaded: true,
            path: `/fake/docs/${selectedFile.name}`,
          };
          return { ...guest, documents: updatedDocs };
        } else {
          // Add new document
          return {
            ...guest,
            documents: [
              ...guest.documents,
              {
                name: folderName,
                uploaded: true,
                path: `/fake/docs/${selectedFile.name}`,
              },
            ],
          };
        }
      }
      return guest;
    });

    onUpdateGuests(updatedGuests);
    setSelectedFile(null);
    setUploadingFor(null);
  };

  const handleDelete = (guestIndex: number) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const updatedGuests = guests.map((guest, index) => {
      if (index === guestIndex) {
        const docIndex = guest.documents.findIndex(
          (d) => d.name.toLowerCase().includes(folderKey.toLowerCase())
        );

        if (docIndex !== -1) {
          const updatedDocs = [...guest.documents];
          updatedDocs[docIndex] = {
            ...updatedDocs[docIndex],
            uploaded: false,
            path: undefined,
          };
          return { ...guest, documents: updatedDocs };
        }
      }
      return guest;
    });

    onUpdateGuests(updatedGuests);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(true);
    setBulkUploadFiles(files);

    // Smart detection: match files to guests automatically
    // For now, upload to first available guests without documents
    const updatedGuests = [...guests];
    let fileIndex = 0;

    for (let i = 0; i < updatedGuests.length && fileIndex < files.length; i++) {
      const docIndex = updatedGuests[i].documents.findIndex(
        (d) => d.name.toLowerCase().includes(folderKey.toLowerCase())
      );

      if (docIndex !== -1 && !updatedGuests[i].documents[docIndex].uploaded) {
        updatedGuests[i].documents[docIndex] = {
          ...updatedGuests[i].documents[docIndex],
          uploaded: true,
          path: `/fake/docs/${files[fileIndex].name}`,
        };
        fileIndex++;
      } else if (docIndex === -1) {
        // Add new document if it doesn't exist
        updatedGuests[i].documents.push({
          name: folderName,
          uploaded: true,
          path: `/fake/docs/${files[fileIndex].name}`,
        });
        fileIndex++;
      }
    }

    onUpdateGuests(updatedGuests);
    setIsBulkUploading(false);
    setBulkUploadFiles(null);
    
    // Reset file input
    event.target.value = '';
  };

  const getStatusColor = (uploaded: boolean) => {
    return uploaded ? "text-green-600" : "text-red-600";
  };

  const getProgressColor = () => {
    if (percentage === 0) return "bg-red-500";
    if (percentage < 50) return "bg-red-500";
    if (percentage < 100) return "bg-orange-500";
    return "bg-green-500";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <MT.Typography
            variant="h5"
            color="blue-gray"
            className="dark:text-white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {folderName} Documents
          </MT.Typography>
          <MT.Typography
            variant="small"
            color="gray"
            className="mt-1 dark:text-gray-300"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {bookingType} Booking • {totalCount} Travelers
          </MT.Typography>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        </div>

      <div className="p-6 overflow-y-auto flex-1">
        {/* Bulk Upload Section */}
        <div className="mb-6">
          <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors ${isBulkUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              type="file"
              id="bulk-upload"
              className="hidden"
              onChange={handleBulkUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              disabled={isBulkUploading}
            />
            <label
              htmlFor="bulk-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {isBulkUploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                  <MT.Typography
                    variant="h6"
                    className="text-gray-700 dark:text-gray-300 mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Uploading {bulkUploadFiles?.length || 0} file(s)...
                  </MT.Typography>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <MT.Typography
                    variant="h6"
                    className="text-gray-700 dark:text-gray-300 mb-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Upload Documents
                  </MT.Typography>
                  <MT.Typography
                    variant="small"
                    className="text-gray-500 dark:text-gray-400"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Click to select files or drag and drop
                  </MT.Typography>
                  <MT.Typography
                    variant="small"
                    className="text-gray-400 dark:text-gray-500 mt-1"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    PDF, JPG, PNG, DOC up to 10MB
                  </MT.Typography>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <MT.Typography
              variant="small"
              className="font-semibold text-gray-700 dark:text-gray-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Overall Progress
            </MT.Typography>
            <MT.Typography
              variant="small"
              className="font-bold text-gray-900 dark:text-white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {uploadedCount}/{totalCount} ({Math.round(percentage)}%)
            </MT.Typography>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${getProgressColor()} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Guest Documents List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {guestDocuments.map((guestDoc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {guestDoc.document?.uploaded ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <MT.Typography
                    variant="small"
                    className="font-semibold text-gray-900 dark:text-white truncate"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {guestDoc.guestName}
                  </MT.Typography>
                  <MT.Typography
                    variant="small"
                    className={`${getStatusColor(guestDoc.document?.uploaded || false)}`}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {guestDoc.document?.uploaded ? "Uploaded" : "Not Uploaded"}
                  </MT.Typography>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {uploadingFor === guestDoc.guestIndex ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`file-${idx}`}
                      className="hidden"
                      onChange={(e) => handleFileSelect(guestDoc.guestIndex, e)}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    {selectedFile ? (
                      <>
                        <MT.Typography
                          variant="small"
                          className="text-gray-700 dark:text-gray-300 max-w-32 truncate"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {selectedFile.name}
                        </MT.Typography>
                        <button
                          onClick={() => handleUpload(guestDoc.guestIndex)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => {
                            setUploadingFor(null);
                            setSelectedFile(null);
                          }}
                          className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <label
                        htmlFor={`file-${idx}`}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    )}
                  </div>
                ) : (
                  <>
                    {guestDoc.document?.uploaded ? (
                      <>
                        <button
                          onClick={() => {
                            if (guestDoc.document?.path) {
                              window.open(guestDoc.document.path, "_blank");
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                          title="View Document"
                        >
                          <DocumentIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guestDoc.guestIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                          title="Delete Document"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setUploadingFor(guestDoc.guestIndex)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <CloudArrowUpIcon className="h-4 w-4" />
                        Upload
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {guestDocuments.length === 0 && (
          <div className="text-center py-8">
            <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <MT.Typography
              variant="h6"
              color="gray"
              className="dark:text-gray-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              No travelers found
            </MT.Typography>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <MT.Button
          variant="outlined"
          color="gray"
          onClick={onClose}
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
