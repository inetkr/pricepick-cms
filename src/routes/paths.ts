const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    root: '/',
  },
  manageUser: {
    root: '/manage-user',
    listUser: '/manage-user/list-user',
    uninstallAppHistory: '/manage-user/uninstall-app-history',
  },
  statistics: {
    root: '/statistics',
    conversion: '/statistics/conversion',
    dailySales: '/statistics/daily-sales',
    monthlySales: '/statistics/monthly-sales',
  },
  pointManagement: {
    root: '/point-management',
    pointLog: '/point-management/point-log',
    refundLog: '/point-management/refund-log',
    paymentLog: '/point-management/payment-log',
    gifticonHistory: '/point-management/gifticon-history',
  },
  boardManagement: {
    root: '/board-management',
    notice: '/board-management/notice',
    addNotice: '/board-management/notice/add',
    editNotice: '/board-management/notice/[id]/edit',
    announcement: '/board-management/announcement',
    addAnnouncement: '/board-management/announcement/add',
    editAnnouncement: '/board-management/announcement/[id]/edit',
    exchangePolicy: '/board-management/exchange-policy',
    addExchangePolicy: '/board-management/exchange-policy/add',
    editExchangePolicy: '/board-management/exchange-policy/[id]/edit',
    faq: '/board-management/faqs',
    addFaq: '/board-management/faqs/add',
    editFaq: '/board-management/faqs/[id]/edit',
    termOfService: '/board-management/term-of-service',
    privacy: '/board-management/privacy',
    qna: '/board-management/qna',
    addQna: '/board-management/qna/add',
    editQna: '/board-management/qna/[id]/edit',
  },
  gifticonManagement: {
    root: '/gifticon-management',
    productList: '/gifticon-management/product-list',
    cancelCouponHistory: '/gifticon-management/cancel-coupon-history',
    bulkImportProduct: '/gifticon-management/bulk-import-product',
  },
  customerService: {
    root: '/customer-service',
    inquiry: '/customer-service/inquiry',
    editInquiry: '/customer-service/inquiry/:id',
    reportReels: '/customer-service/report-reels',
  },
  policy: {
    root: '/policy',
    add: '/policy/add',
    edit: '/policy/[id]/edit'
  },
  adminManagement: {
    root: '/admin-management',
    add: '/admin-management/add',
    edit: '/admin-management/[id]/edit',
  },
};
