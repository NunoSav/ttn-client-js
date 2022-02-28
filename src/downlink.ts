import axios from 'axios';
import { ttnConfig } from './config';
import { Device } from './device';

//#region Interfaces
export interface Payload {
  downlinks: Downlink[];
}

export interface Downlink {
  confirmed: boolean;
  frm_payload: string;
  f_port: number;
}

enum DownlinkQueueMethod {
  Push = 'push',
  Replace = 'replace',
}
//#endregion

//#region Methods
export async function downlinkQueuePush(
  devices: Device[],
  payload: Payload
): Promise<void> {
  if (payload.downlinks.length === 0) throw new Error('Payload contains no downlink data!');

  for await (const device of devices) {
    await queueDownlink(device, payload, DownlinkQueueMethod.Push);
  }
}

export async function downlinkQueueReplace(
  devices: Device[],
  payload: Payload
): Promise<void> {
  if (payload.downlinks.length === 0) throw new Error('Payload contains no downlink data!');

  for await (const device of devices) {
    await queueDownlink(device, payload, DownlinkQueueMethod.Replace);
  }
}

export async function queueDownlink(
  device: Device,
  payload: Payload,
  method: DownlinkQueueMethod
): Promise<void> {
  if (!device.ids.application_ids.application_id)
    throw new Error('Device lacks application identifier!');

  const appId = device.ids.application_ids.application_id;
  const devId = device.ids.device_id;
  const url = `${ttnConfig.domain}/api/v3/as/applications/${appId}/devices/${devId}/down/${method}`;
  const data = JSON.stringify(payload);

  await axios.post(url, data, { headers: ttnConfig.headers });
}
//#endregion
