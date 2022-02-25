import axios from 'axios';
import { ttnConfig } from './client';

//#region Interfaces
export interface Applications {
  applications: Application[];
}

export interface Application {
  ids: ApplicationIdentifiers;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  description: string;
  attributes: Record<string, string>;
  contact_info: ContactInfo[];
  administrative_contact: unknown;
  technical_contact: unknown;
  dev_eui_counter: number;
}

export interface ApplicationIdentifiers {
  application_id: string;
}

export interface ApplicationDownlink {
  session_key_id: string;
  f_port: number;
  f_cnt: number;
  frm_payload: string;
  decoded_payload: unknown;
  decoded_payload_warnings: string[];
  confirmed: boolean;
  class_b_c: ApplicationDownlinkClassBC;
  priority: TxSchedulePriority;
  correlation_ids: string[];
}

interface ApplicationDownlinkClassBC {
  gateways: GatewayAntennaIdentifiers[];
  absolute_time: string;
}

interface GatewayAntennaIdentifiers {
  gateway_ids: GatewayIdentifiers;
  antenna_index: number;
}

interface GatewayIdentifiers {
  gateway_id: string;
  eui: ArrayBuffer;
}

enum TxSchedulePriority {
  LOWEST,
  LOW,
  BELOW_NORMAL,
  NORMAL,
  ABOVE_NORMAL,
  HIGH,
  HIGHEST,
}

interface ContactInfo {
  contact_type: ContactType;
  contact_method: ContactMethod;
  value: string;
  public: boolean;
  validated_at: string;
}

enum ContactType {
  CONTACT_TYPE_OTHER,
  CONTACT_TYPE_ABUSE,
  CONTACT_TYPE_BILLING,
  CONTACT_TYPE_TECHNICAL,
}

enum ContactMethod {
  CONTACT_METHOD_OTHER,
  CONTACT_METHOD_EMAIL,
  CONTACT_METHOD_PHONE,
}
//#endregion

//#region Methods
export async function getAllApplications(): Promise<Applications> {
  const url = `${ttnConfig.domain}/api/v3/applications`;

  const { data } = await axios.get<Applications>(url, {
    headers: ttnConfig.headers,
  });

  return data;
}
//#endregion
