import ContentAPI from "./content-api";
import DashboardAPI from "./dashboard-api";
import EmployeeAPI from "./employee-api";
import FaqAPI from "./faq-api";
import ReportAPI from "./report-api";
import UserAPI from "./user-api";
import QnaAPI from "./qna-api";
import WithdrawAPI from "./withdraw-api";
import ConversionAPI from "./conversion-api";
import InquiryAPI from "./inquiry-api";
import NoticeAPI from "./notice-api";
import PolicyAPI from "./policy-api";
import TransactionCouponHistoryAPI from "./transaction-coupon-history-api";
import StatisticsAPI from "./statistics-api";
import GifticonAPI from "./gifticon-api";
import FallcentRefundAPI from "./fallcent-refund-api";
import AnnouncementAPI from "./announcement-api";
import ExchangePolicyAPI from "./exchange-policy-api";

export const userAPI = new UserAPI();

export const contentAPI = new ContentAPI();

export const dashboardAPI = new DashboardAPI();

export const employeeAPI = new EmployeeAPI();

export const faqAPI = new FaqAPI();

export const qnaAPI = new QnaAPI();

export const reportAPI = new ReportAPI();

export const conversionAPI = new ConversionAPI();

export const withdrawAPI = new WithdrawAPI();

export const inquiryAPI = new InquiryAPI();

export const noticeAPI = new NoticeAPI();

export const policyAPI = new PolicyAPI();

export const transactionCouponHistoryAPI = new TransactionCouponHistoryAPI();

export const statisticsAPI = new StatisticsAPI();

export const gifticonAPI = new GifticonAPI();

export const fallcentRefundAPI = new FallcentRefundAPI();

export const announcementAPI = new AnnouncementAPI();

export const exchangePolicyAPI = new ExchangePolicyAPI();