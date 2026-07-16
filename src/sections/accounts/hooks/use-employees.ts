import { useCallback, useEffect, useState } from 'react';
import { employeeAPI } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { IAdmin, ICreateEmployeePayload, IUpdateEmployeePayload } from 'src/types/admin';

export const useEmployees = () => {
  const { admin } = useAuthContext();
  const { showMessageIcon, showConfirmMessageIcon } = useDialogMessage();
  const [employees, setEmployees] = useState<IAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await employeeAPI.getEmployeeList();
      if (responseData && responseData.result && responseData.result.object.rows) {
        setEmployees(responseData.result.object.rows);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const createEmployee = async (payload: ICreateEmployeePayload) => {
    setIsSaving(true);
    try {
      const responseData = await employeeAPI.createEmployee(payload);
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('관리자 계정이 생성되었습니다.', DialogMessageIcon.success, () => {
          loadEmployees();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create employee:', error);
      showMessageIcon('계정 생성에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmployee = async (id: string, payload: IUpdateEmployeePayload) => {
    setIsSaving(true);
    try {
      const responseData = await employeeAPI.updateEmployee(id, payload);
      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('관리자 계정이 수정되었습니다.', DialogMessageIcon.success, () => {
          loadEmployees();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update employee:', error);
      showMessageIcon('계정 수정에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEmployee = (employee: IAdmin) => {
    showConfirmMessageIcon(
      `'${employee.fullname || employee.username}' 계정을 삭제하시겠습니까?`,
      DialogMessageIcon.alert,
      async () => {
        try {
          await employeeAPI.deleteEmployee(employee.id);
          showMessageIcon('관리자 계정이 삭제되었습니다.', DialogMessageIcon.success, () => {
            loadEmployees();
          });
        } catch (error) {
          console.error('Failed to delete employee:', error);
          showMessageIcon('계정 삭제에 실패했습니다.', DialogMessageIcon.alert);
        }
      }
    );
  };

  return {
    admin,
    employees,
    isLoading,
    isSaving,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    reload: loadEmployees,
  };
};
