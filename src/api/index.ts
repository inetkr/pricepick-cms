import AuthAPI from "./auth-api";
import EmployeeAPI from "./employee-api";
import UserAPI from "./user-api";

export const userAPI = new UserAPI();

export const authAPI = new AuthAPI();

export const employeeAPI = new EmployeeAPI();