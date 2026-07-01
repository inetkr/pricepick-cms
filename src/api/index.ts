import AuthAPI from "./auth-api";
import EmployeeAPI from "./employee-api";
import UserAPI from "./user-api";
import PointAPI from "./point-api";
import TicketAPI from "./ticket-api";

export const userAPI = new UserAPI();

export const authAPI = new AuthAPI();

export const employeeAPI = new EmployeeAPI();

export const pointAPI = new PointAPI();

export const ticketAPI = new TicketAPI();