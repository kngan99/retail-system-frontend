import { NewAccountDto } from "../account/account.dto";

export const newAdminFormInit: NewAccountDto = {
    email: '',
    fName: '',
    lName: '',
    homePhone: '',
    type: '',
};

export const AccountType = [
    {
      key: '',
      label: '',
    },
    {
      key: 'StoreManager',
      label: 'Store Manager',
    },
    {
      key: 'StoreWarehouseManager',
      label: 'Store Warehouse Manager',
    },
    {
        key: 'OperationStaff',
        label: 'Operation Staff',
    },
    {
        key: 'WarehouseStaff',
        label: 'Warehouse Staff',
    },
    {
        key: 'Salescleck',
        label: 'Salescleck',
    },
    {
        key: 'OperationStaff',
        label: 'Operation Staff',
    },
  ];