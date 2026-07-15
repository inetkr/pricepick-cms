import AuthAPI from "./auth-api";
import EmployeeAPI from "./employee-api";
import UserAPI from "./user-api";
import PointAPI from "./point-api";
import TicketAPI from "./ticket-api";
import RevenueAPI from "./revenue-api";
import SettlementAPI from "./settlement-api";
import StatsAPI from "./stats-api";
import ConfigAPI from "./config-api";

export const userAPI = new UserAPI();

export const authAPI = new AuthAPI();

export const employeeAPI = new EmployeeAPI();

export const pointAPI = new PointAPI();

export const ticketAPI = new TicketAPI();

export const revenueAPI = new RevenueAPI();

export const settlementAPI = new SettlementAPI();

export const statsAPI = new StatsAPI();

export const configAPI = new ConfigAPI();