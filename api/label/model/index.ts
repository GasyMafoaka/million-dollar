export interface CreationLabel {
  name?: string;
  color?: string;
  iconRef?: string;
}

export interface Label extends CreationLabel {
  id?: string;
}

export interface PaginationResult {
  totalPage?: number;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface LabelListResponse {
  pagination?: PaginationResult;
  values?: Label[];
}
