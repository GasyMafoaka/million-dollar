export interface CreationLabel {
  name: string;
  color?: string;
  iconRef?: string;
}

export interface Label extends CreationLabel {
  id: string;
}

export interface PaginationResult {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface LabelResponse {
  pagination: PaginationResult;
  values: Label[];
}
