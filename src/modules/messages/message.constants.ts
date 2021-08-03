import { I18N } from "../../i18n.enum";
import { ErrorDto } from "./message.dto";
import { ERRORS } from "./message.enum";


export const Errors: ErrorDto[] = [
  {
    key: ERRORS.DELETE_SUCCESS,
    label: I18N.MESSAGES_DELETE_SUCCESS,
  },
  {
    key: ERRORS.UPDATE_SUCCESS,
    label: I18N.MESSAGES_UPDATE_SUCCESS,
  },
  {
    key: ERRORS.LOGIN_FAIL,
    label: I18N.LOGIN_FAIL,
  }
];
