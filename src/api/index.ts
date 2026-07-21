import AuthAPI from "./auth-api";
import EmployeeAPI from "./employee-api";
import UserAPI from "./user-api";
import PointAPI from "./point-api";
import TicketAPI from "./ticket-api";
import RevenueAPI from "./revenue-api";
import SettlementAPI from "./settlement-api";
import StatsAPI from "./stats-api";
import ConfigAPI from "./config-api";
import ActivityLogAPI from "./activity-log-api";
import PolicyAPI from "./policy-api";
import QnaAPI from "./qna-api";
import AnnouncementAPI from "./announcement-api";
import NotificationAPI from "./notification-api";

export const userAPI = new UserAPI();

export const authAPI = new AuthAPI();

export const employeeAPI = new EmployeeAPI();

export const pointAPI = new PointAPI();

export const ticketAPI = new TicketAPI();

export const revenueAPI = new RevenueAPI();

export const settlementAPI = new SettlementAPI();

export const statsAPI = new StatsAPI();

export const configAPI = new ConfigAPI();

export const activityLogAPI = new ActivityLogAPI();

export const policyAPI = new PolicyAPI();

export const qnaAPI = new QnaAPI();

export const announcementAPI = new AnnouncementAPI();

export const notificationAPI = new NotificationAPI();