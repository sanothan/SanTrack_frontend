import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { villageService } from '../../services/villageService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  MapPin,
  Save,
  X,
  Users,
  Building,
} from 'lucide-react';

// Validation schema
const villageSchema = z.object({
  name: z.string().min(1, 'Village name is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  population: z.number().min(0, 'Population must be a positive number').optional(),
  totalHouseholds: z.number().min(0, 'Total households must be a positive number').optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
    lng: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  }).optional(),
});

const VillageForm = ({ village, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!village;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      name: '',
      district: '',
      state: '',
      population: 0,
      totalHouseholds: 0,
      coordinates: {
        lat: 0,
        lng: 0,
      },
      ...village,
    },
  });

  const watchedCoordinates = watch('coordinates');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await villageService.updateVillage(village._id, data);
        toast.success('Village updated successfully');
      } else {
        await villageService.createVillage(data);
        toast.success('Village created successfully');
      }
      
      onSuccess?.();
      onClose?.();
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('coordinates.lat', position.coords.latitude);
          setValue('coordinates.lng', position.coords.longitude);
        },
        (error) => {
          toast.error('Unable to get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Village' : 'Add New Village'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Village Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Village Name *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('name')}
                className={`block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter village name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              District *
            </label>
            <input
              type="text"
              {...register('district')}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.district ? 'border-red-500' : ''
              }`}
              placeholder="Enter district name"
            />
            {errors.district && (
              <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              {...register('state')}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.state ? 'border-red-500' : ''
              }`}
              placeholder="Enter state name"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          {/* Population and Households */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Population
              </label>
              <input
                type="number"
                {...register('population', { valueAsNumber: true })}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.population ? 'border-red-500' : ''
                }`}
                placeholder="0"
                min="0"
              />
              {errors.population && (
                <p className="mt-1 text-sm text-red-600">{errors.population.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Households
              </label>
              <input
                type="number"
                {...register('totalHouseholds', { valueAsNumber: true })}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.totalHouseholds ? 'border-red-500' : ''
                }`}
                placeholder="0"
                min="0"
              />
              {errors.totalHouseholds && (
                <p className="mt-1 text-sm text-red-600">{errors.totalHouseholds.message}</p>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordinates (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('coordinates.lat', { valueAsNumber: true })}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.coordinates?.lat ? 'border-red-500' : ''
                  }`}
                  placeholder="0.0000"
                  min="-90"
                  max="90"
                />
                {errors.coordinates?.lat && (
                  <p className="mt-1 text-sm text-red-600">{errors.coordinates.lat.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('coordinates.lng', { valueAsNumber: true })}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.coordinates?.lng ? 'border-red-500' : ''
                  }`}
                  placeholder="0.0000"
                  min="-180"
                  max="180"
                />
                {errors.coordinates?.lng && (
                  <p className="mt-1 text-sm text-red-600">{errors.coordinates.lng.message}</p>
                )}
              </div>
            </div>
            
            {/* Get Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Use Current Location
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'} Village
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VillageForm;
