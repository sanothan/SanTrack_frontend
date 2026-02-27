import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { inspectionService } from '../../services/inspectionService.js';
import { facilityService } from '../../services/facilityService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { FACILITY_TYPES, INSPECTION_STATUS, UPLOAD_LIMITS } from '../../utils/constants.js';
import toast from 'react-hot-toast';
import {
  Camera,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle,
  Upload,
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

// Validation schema
const inspectionSchema = z.object({
  facility: z.string().min(1, 'Facility is required'),
  date: z.string().min(1, 'Inspection date is required'),
  score: z.number().min(1).max(10, 'Score must be between 1 and 10'),
  status: z.enum(['good', 'needs_attention', 'critical'], 'Status is required'),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
  nextInspectionDue: z.string().min(1, 'Next inspection date is required'),
  photos: z.array(z.string()).optional(),
});

const InspectionForm = ({ inspection, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isEditing = !!inspection;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      facility: '',
      date: new Date().toISOString().split('T')[0],
      score: 5,
      status: 'good',
      notes: '',
      recommendations: '',
      nextInspectionDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      photos: [],
      ...inspection,
    },
  });

  const watchedScore = watch('score');
  const watchedStatus = watch('status');
  const watchedFacility = watch('facility');

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await facilityService.getFacilities();
        setFacilities(response.data || []);
      } catch (error) {
        toast.error('Failed to fetch facilities');
      }
    };
    fetchFacilities();
  }, []);

  // Update status based on score
  useEffect(() => {
    if (watchedScore >= 8) {
      setValue('status', 'good');
    } else if (watchedScore >= 5) {
      setValue('status', 'needs_attention');
    } else {
      setValue('status', 'critical');
    }
  }, [watchedScore, setValue]);

  // File upload handling
  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => 
      UPLOAD_LIMITS.ALLOWED_TYPES.includes(file.type) && 
      file.size <= UPLOAD_LIMITS.MAX_FILE_SIZE
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast.error('Some files were rejected due to invalid type or size');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize: UPLOAD_LIMITS.MAX_FILE_SIZE,
    maxFiles: UPLOAD_LIMITS.MAX_FILES - uploadedFiles.length,
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (uploadedFiles.length === 0) return;

    setIsLoading(true);
    try {
      // In a real implementation, you would upload files to your server
      // For now, we'll simulate the upload
      setUploadProgress(0);
      
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadProgress(100);
        
        // Simulate successful upload and get URLs
        const photoUrls = uploadedFiles.map(file => URL.createObjectURL(file));
        setValue('photos', photoUrls);
        setUploadedFiles([]);
        setUploadProgress(0);
        setIsLoading(false);
        toast.success('Images uploaded successfully');
      }, 2000);
    } catch (error) {
      toast.error('Failed to upload images');
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await inspectionService.updateInspection(inspection._id, data);
        toast.success('Inspection updated successfully');
      } else {
        await inspectionService.createInspection(data);
        toast.success('Inspection created successfully');
      }
      
      onSuccess?.();
      onClose?.();
      reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs_attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Inspection' : 'New Inspection'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step === 1 && <MapPin className="w-4 h-4" />}
                  {step === 2 && <Camera className="w-4 h-4" />}
                  {step === 3 && <FileText className="w-4 h-4" />}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Facility</span>
            <span>Inspection Details</span>
            <span>Photos & Review</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Step 1: Select Facility */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Facility *
                </label>
                <select
                  {...register('facility')}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.facility ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Choose a facility...</option>
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.name} - {facility.type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {errors.facility && (
                  <p className="mt-1 text-sm text-red-600">{errors.facility.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inspection Date *
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.date ? 'border-red-500' : ''
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Inspection Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Score Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Inspection Score: <span className={`font-bold ${getScoreColor(watchedScore)}`}>{watchedScore}</span>
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    {...register('score', { valueAsNumber: true })}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">10</span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className="text-green-600">Good (8-10)</span>
                  <span className="text-yellow-600">Needs Attention (5-7)</span>
                  <span className="text-red-600">Critical (1-4)</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {Object.values(INSPECTION_STATUS).map((status) => (
                    <label key={status} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('status')}
                        value={status}
                        className="mr-2"
                      />
                      {getStatusIcon(status)}
                      <span className="ml-2 text-sm">{status.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.notes ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter inspection notes..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recommendations
                </label>
                <textarea
                  {...register('recommendations')}
                  rows={4}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.recommendations ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter recommendations..."
                />
                {errors.recommendations && (
                  <p className="mt-1 text-sm text-red-600">{errors.recommendations.message}</p>
                )}
              </div>

              {/* Next Inspection Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Next Inspection Due *
                </label>
                <input
                  type="date"
                  {...register('nextInspectionDue')}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.nextInspectionDue ? 'border-red-500' : ''
                  }`}
                />
                {errors.nextInspectionDue && (
                  <p className="mt-1 text-sm text-red-600">{errors.nextInspectionDue.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Photos & Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload Photos (Optional)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop photos here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum {UPLOAD_LIMITS.MAX_FILES} files, up to {UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB each
                  </p>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={uploadImages}
                      disabled={isLoading || uploadProgress > 0}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadProgress > 0 ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading... {uploadProgress}%
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Photos
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Existing Photos */}
                {watch('photos') && watch('photos').length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Photos:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {watch('photos').map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Inspection photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Inspection Summary</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Facility:</strong> {facilities.find(f => f._id === watchedFacility)?.name || 'Selected'}</div>
                  <div><strong>Score:</strong> <span className={getScoreColor(watchedScore)}>{watchedScore}/10</span></div>
                  <div><strong>Status:</strong> {watchedStatus?.replace('_', ' ').toUpperCase()}</div>
                  <div><strong>Next Inspection:</strong> {watch('nextInspectionDue')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? 'Update Inspection' : 'Create Inspection'}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
