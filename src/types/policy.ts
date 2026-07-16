import type { IBase } from './base';
import type { IPolicyType } from './common';

export type IPolicy = IBase & {
  id: string;
  employee_id: string | null;
  title: string;
  content: string;
  type: IPolicyType;
  is_published: boolean;
};

export type ICreatePolicyPayload = {
  title: string;
  content: string;
  type: IPolicyType;
  is_published: boolean;
};

export type IUpdatePolicyPayload = {
  title: string;
  content: string;
  type: IPolicyType;
  is_published: boolean;
};
