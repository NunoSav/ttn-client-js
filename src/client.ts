import { Applications, getAllApplications } from "./application";
import { Device, Devices, getAllDevices, getDevices } from "./device";
import { downlinkQueuePush, downlinkQueueReplace } from "./downlink";

//#region Interfaces
export interface ClientOptions {
  /**
   * Personal User API key
   */
  apiKey?: string;

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
  setAPIKey(key: string): void;
}
//#endregion

export const ttnConfig: TTNConfig = {};

export function client(options: ClientOptions): Client {
  if (options.apiKey && options.apiKey !== '') setAPIKey(options.apiKey);

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
    setAPIKey,
  };

  return response;
}

function setAPIKey(key: string): void {
  const keyParts = key.split(".");

  if (keyParts.length !== 3)
    throw new Error(
      "API Key is malformatted. The key should have the following format: <token-type>.<token-id>.<token-secret>. Refer to https://www.thethingsindustries.com/docs/reference/api/authentication/ for more information."
    );
  
  ttnConfig.apiKey = key;
}
