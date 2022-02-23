import { Applications, getAllApplications } from "./application";
import { Device, Devices, getAllDevices, getDevices } from "./device";
import { downlinkQueuePush, downlinkQueueReplace } from "./downlink";

//#region Interfaces
export interface ClientOptions {
  /**
   * Personal User API key
   */
  apiKey: string;

  /**
   * Domain of your account (e.g.: https://eu1.cloud.thethings.network)
   */
  domain: string;
}

interface TTNConfig extends Partial<ClientOptions> {
  headers?: Record<string, string>;
}

interface Client {
  getAllApplications(): Promise<Applications>;
  getAllDevices(): Promise<Devices>;
  getDevices(applicationIdentifier: string): Promise<Devices>;
  downlinkQueuePush(devices: Device[], base64Payload: string): Promise<void>;
  downlinkQueueReplace(devices: Device[], base64Payload: string): Promise<void>;
}
//#endregion

export const ttnConfig: TTNConfig = {};

export function client(options: ClientOptions): Client {
  ttnConfig.apiKey = options.apiKey;
  ttnConfig.domain = options.domain;
  ttnConfig.headers = {
    Authorization: `Bearer ${options.apiKey}`,
    "Content-Type": "application/json",
  };

  const response: Client = {
    getAllApplications,
    getAllDevices,
    getDevices,
    downlinkQueuePush,
    downlinkQueueReplace,
  };

  return response;
}
