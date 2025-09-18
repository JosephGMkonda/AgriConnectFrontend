
import React from 'react';

interface MediaPreviewProps {
  files: File[];
  uploadResults: UploadResult[];
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  files,
  uploadResults,
  onRemove,
  isUploading
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
      {files.map((file, index) => {
        const uploadResult = uploadResults[index];
        const isUploaded = !!uploadResult;

        return (
          <div key={index} className="relative group">
            {file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-24 object-cover rounded-lg"
              />
            ) : file.type.startsWith('video/') ? (
              <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            )}

            {/* Upload Status */}
            {isUploading && !isUploaded && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}

            {isUploaded && (
              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 text-xs">
                ✅
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>

            {/* File Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
              <div className="truncate">{file.name}</div>
              <div className="text-xs opacity-75">
                {(file.size / 1024 / 1024).toFixed(1)}MB
                {uploadResult?.duration && ` • ${Math.round(uploadResult.duration)}s`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};