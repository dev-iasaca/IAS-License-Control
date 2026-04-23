export type JobFamily = {
  no: number;
  code: string;
  name: string;
  nameAlign: string;
};

export const JOB_FAMILIES: JobFamily[] = [
  { no: 1, code: 'JFM-00416', name: 'Airport Engineering', nameAlign: 'Airport Engineering' },
  { no: 2, code: 'JFM-00417', name: 'Airport Operation', nameAlign: 'Airport Operation' },
  { no: 3, code: 'JFM-00418', name: 'Asset Management', nameAlign: 'Asset Management' },
  { no: 4, code: 'JFM-00419', name: 'Audit, Legal & Compliance', nameAlign: 'Audit, Legal, and Compliance' },
  { no: 5, code: 'JFM-00420', name: 'Business Development', nameAlign: 'Business Development' },
  { no: 6, code: 'JFM-00421', name: 'Corporate Communication', nameAlign: 'Corporate Relation and Communication' },
  { no: 7, code: 'JFM-00422', name: 'Customer Service Management', nameAlign: 'Customer Service Management' },
  { no: 8, code: 'JFM-00423', name: 'Finance & Accounting', nameAlign: 'Finance and Accounting' },
  { no: 9, code: 'JFM-00424', name: 'Human Capital', nameAlign: 'People Management' },
  { no: 10, code: 'JFM-00425', name: 'Information Technology', nameAlign: 'Information Technology' },
  { no: 11, code: 'JFM-00426', name: 'Procurement', nameAlign: 'Procurement' },
  { no: 12, code: 'JFM-00427', name: 'Quality, Safety & Security', nameAlign: 'Quality, Safety and Security' },
  { no: 13, code: 'JFM-00428', name: 'Supply Chain Management', nameAlign: 'Supply Chain Management' },
];
