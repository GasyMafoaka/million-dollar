import { CreationLabel, Label, LabelListResponse } from "./model";

export const offlineGetAllLabels = async (
  _accountId: string,
): Promise<LabelListResponse> => {
  return {
    pagination: {
      totalPage: 1,
      page: 1,
      hasNext: false,
      hasPrev: false,
    },
    values: [
      { id: "1", name: "Food", color: "#FF5733" },
      { id: "2", name: "Transport", color: "#33FF57" },
    ],
  };
};

export const offlineCreateOneLabel = async (
  _accountId: string,
  label: CreationLabel,
): Promise<Label> => {
  return {
    ...label,
    id: Math.random().toString(),
  };
};
