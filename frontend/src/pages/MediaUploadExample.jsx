import React, { useState } from 'react';
import FileUpload from '../components/ui/FileUpload';
import mediaService from '../services/mediaService';

const MediaUploadExample = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Cloudinary Media Upload Examples</h1>
      
      {/* Profile Picture Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Picture Upload</h2>
        <FileUpload
          uploadType="profile"
          maxFiles={1}
          maxSizeInMB={5}
          onFileUpload={(result, files) => {
            console.log('Profile picture result:', result);
            setProfilePicture(result);
            setUploadResults(prev => [...prev, { type: 'Profile Picture', result }]);
          }}
          onFileRemove={() => {
            setProfilePicture(null);
          }}
        />
        {profilePicture && (
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="text-green-800">✅ Profile picture uploaded successfully!</p>
            <p className="text-sm text-gray-600">URL: {profilePicture.url}</p>
          </div>
        )}
      </div>

      {/* Portfolio Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Upload (Images & Videos)</h2>
        <FileUpload
          uploadType="portfolio"
          maxFiles={5}
          maxSizeInMB={10}
          allowVideo={true}
          onFileUpload={(result, files) => {
            console.log('Portfolio result:', result);
            setPortfolioItems(prev => [...prev, ...result.files]);
            setUploadResults(prev => [...prev, { type: 'Portfolio', result }]);
          }}
          onFileRemove={(file, index, isExisting) => {
            if (isExisting) {
              // Handle removing existing files from portfolio
              setPortfolioItems(prev => prev.filter((_, i) => i !== index));
            }
          }}
          existingFiles={portfolioItems}
        />
      </div>

      {/* ID Verification Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">ID Verification Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">ID Front</h3>
            <FileUpload
              uploadType="verification"
              maxFiles={1}
              maxSizeInMB={10}
              acceptedTypes={['image/jpeg', 'image/png']}
              onFileUpload={(result, files) => {
                console.log('ID Front result:', result);
                setUploadResults(prev => [...prev, { type: 'ID Front', result }]);
              }}
              uploadText="Upload front of ID"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">ID Back</h3>
            <FileUpload
              uploadType="verification"
              maxFiles={1}
              maxSizeInMB={10}
              acceptedTypes={['image/jpeg', 'image/png']}
              onFileUpload={(result, files) => {
                console.log('ID Back result:', result);
                setUploadResults(prev => [...prev, { type: 'ID Back', result }]);
              }}
              uploadText="Upload back of ID"
            />
          </div>
        </div>
      </div>

      {/* Job Image Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Job Image Upload</h2>
        <FileUpload
          uploadType="job"
          maxFiles={1}
          maxSizeInMB={5}
          onFileUpload={(result, files) => {
            console.log('Job image result:', result);
            setUploadResults(prev => [...prev, { type: 'Job Image', result }]);
          }}
          uploadText="Upload job image"
        />
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <FileUpload
          uploadType="document"
          maxFiles={1}
          maxSizeInMB={10}
          acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          onFileUpload={(result, files) => {
            console.log('Document result:', result);
            setUploadResults(prev => [...prev, { type: 'Document', result }]);
          }}
          uploadText="Upload document (PDF, DOC, DOCX)"
        />
      </div>

      {/* Results Display */}
      {uploadResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
          <div className="space-y-4">
            {uploadResults.map((result, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded">
                <h3 className="font-medium text-gray-900">{result.type}</h3>
                <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Service Helper Functions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Media Service Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              const optimizedUrl = mediaService.getOptimizedUrl('sample-public-id', {
                width: 300,
                height: 200,
                quality: 'auto'
              });
              console.log('Optimized URL:', optimizedUrl);
            }}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get Optimized URL
          </button>
          <button
            onClick={() => {
              mediaService.deleteMediaFile('sample-public-id', 'image')
                .then(result => console.log('Delete result:', result))
                .catch(error => console.error('Delete error:', error));
            }}
            className="p-3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Media File
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadExample;
