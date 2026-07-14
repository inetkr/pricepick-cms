import { useState, useEffect } from 'react';
import { revenueAPI } from 'src/api';
import type { IFeeRevenue, IGifticonRevenue } from 'src/types/revenue/revenue';
import type { IRevenueStat } from 'src/types/revenue/revenue_stat';

type IFeeFilters = {
  search: string;
  mall: string;
};

type IGifticonFilters = {
  search: string;
};

const emptyStat: IRevenueStat = {
  fee_revenue_this_month: 0,
  gifticon_revenue_this_month: 0,
  total_revenue_this_month: 0,
};

export const useRevenue = () => {
  const [stats, setStats] = useState<IRevenueStat>(emptyStat);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const [feeRevenues, setFeeRevenues] = useState<IFeeRevenue[]>([]);
  const [feeFilters, setFeeFilters] = useState<IFeeFilters>({ search: '', mall: '' });
  const [feePage, setFeePage] = useState(1);
  const [feeLimit, setFeeLimit] = useState(10);
  const [feeTotalPages, setFeeTotalPages] = useState(1);
  const [feeTotalItems, setFeeTotalItems] = useState(0);
  const [isFeeLoading, setIsFeeLoading] = useState(true);

  const [gifticonRevenues, setGifticonRevenues] = useState<IGifticonRevenue[]>([]);
  const [gifticonFilters, setGifticonFilters] = useState<IGifticonFilters>({ search: '' });
  const [gifticonPage, setGifticonPage] = useState(1);
  const [gifticonLimit, setGifticonLimit] = useState(10);
  const [gifticonTotalPages, setGifticonTotalPages] = useState(1);
  const [gifticonTotalItems, setGifticonTotalItems] = useState(0);
  const [isGifticonLoading, setIsGifticonLoading] = useState(true);

  const loadStats = async () => {
    setIsStatsLoading(true);
    try {
      const responseData = await revenueAPI.getRevenueStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load revenue stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const loadFeeRevenues = async () => {
    setIsFeeLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(feeFilters).filter(([, value]) => value)
      ) as IFeeFilters;
      const responseData = await revenueAPI.getFeeRevenueList(feePage, feeLimit, filter);
      if (responseData && responseData.result && responseData.result.object) {
        setFeeRevenues(responseData.result.object.rows);
        setFeeTotalItems(responseData.result.object.count);
        setFeeTotalPages(Math.max(1, Math.ceil(responseData.result.object.count / feeLimit)));
      }
    } catch (error) {
      console.error('Failed to load fee revenues:', error);
    } finally {
      setIsFeeLoading(false);
    }
  };

  const loadGifticonRevenues = async () => {
    setIsGifticonLoading(true);
    try {
      const filter = Object.fromEntries(
        Object.entries(gifticonFilters).filter(([, value]) => value)
      ) as IGifticonFilters;
      const responseData = await revenueAPI.getGifticonRevenueList(
        gifticonPage,
        gifticonLimit,
        filter
      );
      if (responseData && responseData.result && responseData.result.object) {
        setGifticonRevenues(responseData.result.object.rows);
        setGifticonTotalItems(responseData.result.object.count);
        setGifticonTotalPages(
          Math.max(1, Math.ceil(responseData.result.object.count / gifticonLimit))
        );
      }
    } catch (error) {
      console.error('Failed to load gifticon revenues:', error);
    } finally {
      setIsGifticonLoading(false);
    }
  };

  const handleSetFeeFilters = (newFilters: IFeeFilters) => {
    setFeePage(1);
    setFeeFilters(newFilters);
  };

  const handleSetGifticonFilters = (newFilters: IGifticonFilters) => {
    setGifticonPage(1);
    setGifticonFilters(newFilters);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadFeeRevenues();
  }, [feeFilters, feePage, feeLimit]);

  useEffect(() => {
    loadGifticonRevenues();
  }, [gifticonFilters, gifticonPage, gifticonLimit]);

  return {
    stats,
    isStatsLoading,
    feeRevenues,
    setFeeFilters: handleSetFeeFilters,
    feePage,
    setFeePage,
    feeLimit,
    setFeeLimit,
    feeTotalPages,
    feeTotalItems,
    isFeeLoading,
    gifticonRevenues,
    setGifticonFilters: handleSetGifticonFilters,
    gifticonPage,
    setGifticonPage,
    gifticonLimit,
    setGifticonLimit,
    gifticonTotalPages,
    gifticonTotalItems,
    isGifticonLoading,
  };
};
