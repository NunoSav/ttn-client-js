import axios from 'axios';
import {
  ApplicationDownlink,
  ApplicationIdentifiers,
  getAllApplications,
} from './application';
import { ttnConfig } from './config';

//#region Interfaces
export interface Devices {
  end_devices: Device[];
}

export interface Device {
  ids: DeviceIdentifiers;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  attributes: Record<string, string>;
  version_ids: DeviceVersionIdentifiers;
  service_profile_id: string;
  network_server_address: string;
  network_server_kek_label: string;
  application_server_address: string;
  application_server_kek_label: string;
  application_server_id: string;
  join_server_address: string;
  locations: Record<string, DeviceLocation>;
  picture: DevicePicture;
  supports_class_b: boolean;
  supports_class_c: boolean;
  lorawan_version: string;
  lorawan_phy_version: string;
  frequency_plan_id: string;
  min_frequency: number;
  max_frequency: number;
  supports_join: boolean;
  resets_join_nonces: boolean;
  root_keys: RootKeys;
  net_id: ArrayBuffer;
  mac_settings: MACSettings;
  mac_state: unknown;
  pending_mac_state: unknown;
  session: unknown;
  pending_session: unknown;
  last_dev_nonce: number;
  used_dev_nonces: number[];
  last_join_nonce: number;
  last_rj_count_0: number;
  last_rj_count_1: number;
  last_dev_status_received_at: string;
  power_state: string;
  battery_percentage: number;
  downlink_margin: number;
  queued_application_downlinks: ApplicationDownlink[];
  formatters: MessagePayloadFormatters;
  provisioner_id: string;
  provisioning_data: unknown;
  multicast: boolean;
  claim_authentication_code: unknown;
  skip_payload_crypto: boolean;
  skip_payload_crypto_override: boolean;
  activated_at: string;
}

export interface DeviceIdentifiers {
  device_id: string;
  application_ids: ApplicationIdentifiers;
  dev_eui: string;
  join_eui: string;
  dev_addr: string;
}

interface DeviceVersionIdentifiers {
  brand_id: string;
  model_id: string;
  hardware_version: string;
  firmware_version: string;
  band_id: string;
}

interface DeviceLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  source: string;
}

interface DevicePicture {
  embedded: {
    mime_type: string;
    data: ArrayBuffer;
  };
  sizes: Record<number, string>;
}

interface RootKeys {
  root_key_id: string;
  app_key: {};
  nwk_key: {};
}

interface MACSettings {
  class_b_timeout: string;
  ping_slot_periodicity: unknown;
  ping_slot_data_rate_index: unknown;
  ping_slot_frequency: unknown;
  beacon_frequency: unknown;
  class_c_timeout: string;
  rx1_delay: unknown;
  rx1_data_rate_offset: unknown;
  rx2_data_rate_index: unknown;
  rx2_frequency: unknown;
  factory_preset_frequencies: [];
  max_duty_cycle: unknown;
  supports_32_bit_f_cnt: unknown;
  use_adr: unknown;
  adr_margin: null;
  resets_f_cnt: unknown;
  status_time_periodicity: string;
  status_count_periodicity: null;
  desired_rx1_delay: unknown;
  desired_rx1_data_rate_offset: unknown;
  desired_rx2_data_rate_index: unknown;
  desired_rx2_frequency: unknown;
  desired_max_duty_cycle: unknown;
  desired_adr_ack_limit_exponent: unknown;
  desired_adr_ack_delay_exponent: unknown;
  desired_ping_slot_data_rate_index: unknown;
  desired_ping_slot_frequency: unknown;
  desired_beacon_frequency: unknown;
  desired_max_eirp: unknown;
  class_b_c_downlink_interval: string;
}

interface MessagePayloadFormatters {
  up_formatter: PayloadFormatter;
  up_formatter_parameter: string;
  down_formatter: PayloadFormatter;
  down_formatter_parameter: string;
}

enum PayloadFormatter {
  FORMATTER_NONE, //	No payload formatter to work with raw payload only.
  FORMATTER_REPOSITORY, //	Use payload formatter for the end device type from a repository.
  FORMATTER_GRPC_SERVICE, //	gRPC service payload formatter. The parameter is the host:port of the service.
  FORMATTER_JAVASCRIPT, //	Custom payload formatter that executes Javascript code. The parameter is a JavaScript filename.
  FORMATTER_CAYENNELPP,
}
//#endregion

//#region Methods
export async function getAllDevices(): Promise<Devices> {
  const applicationList = await getAllApplications();
  const devices: Devices = {
    end_devices: [],
  };

  for await (const application of applicationList.applications) {
    const applicationDevices = await getDevices(application.ids.application_id);
    devices.end_devices.push(...applicationDevices.end_devices);
  }

  return devices;
}

export async function getDevices(applicationId: string): Promise<Devices> {
  const url = `${ttnConfig.domain}/api/v3/applications/${applicationId}/devices`;

  const { data } = await axios.get<Devices>(url, {
    headers: ttnConfig.headers,
  });

  return data;
}
//#endregion
