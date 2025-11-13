import type { Ad, AdsResponse, GetAdsParams } from '../types';
import axiosClient from './axiosClient';

/**
 * Fetches a list of ads based on the provided filters, sorting, and pagination.
 * @param params - The query parameters for the request.
 * @returns A promise that resolves to an object containing the ads and pagination info.
 */
export const getAds = async (params: GetAdsParams): Promise<AdsResponse> => {
  try {
    const response = await axiosClient.get<AdsResponse>('/ads', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    throw new Error('Could not fetch adverts.');
  }
};

/**
 * Fetches a single advertisement by its ID.
 * @param id - The ID of the ad to fetch.
 * @returns A promise that resolves to the ad object.
 */
export const getAdById = async (id: number): Promise<Ad> => {
  try {
    const response = await axiosClient.get<Ad>(`/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ad with ID ${id}:`, error);
    throw new Error('Could not fetch the advert.');
  }
};