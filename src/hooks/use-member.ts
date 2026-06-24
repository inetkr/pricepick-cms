// src/hooks/useMembers.ts
import { useState, useEffect, useCallback } from 'react';
import { Member, MemberStats } from 'src/types/members/member';

// Mock data - thay bằng API call
const mockMembers: Member[] = [
  {
    id: 1,
    nickname: '쇼핑왕민준',
    kakaoId: 'minjun_kakao',
    joinType: '카카오 연동',
    joinDate: '2024/08/12',
    joinTime: '09:14:22',
    randomTicket: 2,
    conversion: [{ type: 'bronze', n: '+1' }, { type: 'silver', n: '+1' }],
    tickets: { grade: { bronze: 12, silver: 8, gold: 27 }, event: 3 },
    marketing: 'all',
    status: '정상',
    accounts: [{ type: 'kakao', label: '카카오', email: 'minjun_kakao', joinDate: '2024/08/12' }],
  },
  {
    id: 2,
    nickname: '가격헌터서연',
    kakaoId: 'seoyeon_kko',
    joinType: 'Apple+카카오 연동',
    joinDate: '2024/11/03',
    joinTime: '14:37:05',
    randomTicket: 1,
    conversion: [{ type: 'gold', n: '+1' }],
    tickets: { grade: { bronze: 9, silver: 14, gold: 0 }, event: 1 },
    marketing: 'sel',
    status: '정상',
    accounts: [],
  },
  {
    id: 3,
    nickname: '절약러지호',
    kakaoId: 'jiho_kakao',
    joinType: 'Google+카카오 연동',
    joinDate: '2025/02/28',
    joinTime: '11:02:48',
    randomTicket: 0,
    conversion: [],
    tickets: { grade: { bronze: 0, silver: 0, gold: 0 }, event: 0 },
    marketing: 'none',
    status: '정지',
    accounts: [
      { type: 'kakao', label: '카카오', email: 'jiho_kakao', joinDate: '2025/02/28' },
    ],
  },
  {
    id: 4,
    nickname: '핫딜탐정',
    kakaoId: 'hotdeal_kko',
    joinType: '카카오 연동',
    joinDate: '2025/05/14',
    joinTime: '16:55:33',
    randomTicket: 3,
    conversion: [{ type: 'bronze', n: '+2' }, { type: 'silver', n: '+1' }],
    tickets: { grade: { bronze: 5, silver: 7, gold: 0 }, event: 2 },
    marketing: 'all',
    status: '정상',
    accounts: [{ type: 'kakao', label: '카카오', email: 'hotdeal_kko', joinDate: '2025/05/14' }],
  },
];

const mockStats: MemberStats = {
  total: 12847,
  kakao: 9841,
  kakaoRate: 76.7,
  notLinked: 1823,
  notLinkedRate: 14.2,
  marketingAgreed: 12418,
  marketingRate: 67.4,
};

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats>(mockStats);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    joinType: '',
    status: '',
    marketing: '',
  });

  // Load members
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMembers(mockMembers);
        setFilteredMembers(mockMembers);
      } catch (error) {
        console.error('Failed to load members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = members;

    // Search
    if (searchTerm) {
      result = result.filter(m =>
        m.nickname.includes(searchTerm) ||
        m.kakaoId.includes(searchTerm)
      );
    }

    // Join type filter
    if (filters.joinType) {
      result = result.filter(m => {
        if (filters.joinType === 'kakao') {
          return m.accounts.length === 1 && m.accounts[0].type === 'kakao';
        }
        if (filters.joinType === 'apple') {
          return m.accounts.some(a => a.type === 'apple');
        }
        if (filters.joinType === 'google') {
          return m.accounts.some(a => a.type === 'google');
        }
        return true;
      });
    }

    // Status filter
    if (filters.status) {
      result = result.filter(m => m.status === filters.status);
    }

    // Marketing filter
    if (filters.marketing) {
      result = result.filter(m => m.marketing === filters.marketing);
    }

    setFilteredMembers(result);
  }, [members, searchTerm, filters]);

  // Actions
  const updateMemberStatus = useCallback((id: number, newStatus: '정상' | '정지' | '탈퇴') => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id ? { ...m, status: newStatus } : m
      )
    );
  }, []);

  const updateMember = useCallback((updatedMember: Member) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === updatedMember.id ? updatedMember : m
      )
    );
  }, []);

  const grantTicket = useCallback((memberId: number, grade: string, quantity: number) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id !== memberId) return m;
        const key = grade as keyof typeof m.tickets.grade;
        return {
          ...m,
          tickets: {
            ...m.tickets,
            grade: {
              ...m.tickets.grade,
              [key]: m.tickets.grade[key] + quantity,
            },
          },
        };
      })
    );
  }, []);

  return {
    members: filteredMembers,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateMemberStatus,
    updateMember,
    grantTicket,
  };
};