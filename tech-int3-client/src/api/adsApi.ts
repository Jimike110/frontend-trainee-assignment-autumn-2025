import type { Ad, AdsResponse, GetAdsParams } from '../types';
import axiosClient from './axiosClient';

export interface AdPayload {
  reason: string;
  comment?: string;
}

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

/**
 * Approves a specific ad.
 * @param id - The ID of the ad to approve.
 * @returns A promise that resolves to the updated ad object.
 */
export const approveAd = async (id: number): Promise<Ad> => {
  try {
    const response = await axiosClient.post<Ad>(`/ads/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Failed to approve ad with ID ${id}:`, error);
    throw new Error('Could not approve the advert.');
  }
};

/**
 * Rejects a specific ad with a reason and optional comment.
 * @param id - The ID of the ad to reject.
 * @param payload - The rejection reason and optional comment.
 * @returns A promise that resolves to the updated ad object.
 */
export const rejectAd = async (id: number, payload: AdPayload): Promise<Ad> => {
  try {
    const response = await axiosClient.post<Ad>(`/ads/${id}/reject`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to reject ad with ID ${id}:`, error);
    throw new Error('Could not reject the advert.');
  }
};

/**
 * Approves multiple ads by their IDs.
 * @param ids - An array of ad IDs to approve.
 * @returns A promise that resolves when the operation is complete.
 */
export const approveMultipleAds = async (ids: number[]): Promise<void> => {
  const approvePromises = ids.map((id) => approveAd(id));
  await Promise.all(approvePromises);
};

/**
 * Rejects multiple ads by their IDs.
 * @param ids - An array of ad IDs to reject.
 * @param payload - The rejection reason and optional comment.
 * @returns A promise that resolves when the operation is complete.
 */
export const rejectMultipleAds = async (
  ids: number[],
  payload: AdPayload
): Promise<void> => {
  const rejectPromises = ids.map((id) => rejectAd(id, payload));
  await Promise.all(rejectPromises);
};

/**
 * Fetches the count of the new pending ads created since a given timestamp.
 * @param since - An ISO timestamp string.
 * @returns A promise that resolves to an object with the new ad count.
 */
export const getNewAdsCount = async (
  since: string
): Promise<{ newCount: number }> => {
  const response = await axiosClient.get('/ads/new-count', {
    params: { since },
  });
  return response.data;
};
