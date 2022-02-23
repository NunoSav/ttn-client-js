import axios from "axios";
import { ttnConfig } from "./client";
import { Device } from "./device";

//#region Interfaces
enum DownlinkQueueMethod {
  Push = "push",
  Replace = "replace",
}
//#endregion

//#region Methods
export async function downlinkQueuePush(
  devices: Device[],
  base64Payload: string
): Promise<void> {
  for await (const device of devices) {
    await queueDownlink(device, base64Payload, DownlinkQueueMethod.Push);
  }
}

export async function downlinkQueueReplace(
  devices: Device[],
  base64Payload: string
): Promise<void> {
  for await (const device of devices) {
    await queueDownlink(device, base64Payload, DownlinkQueueMethod.Replace);
  }
}

export async function queueDownlink(
  device: Device,
  base64Payload: string,
  method: DownlinkQueueMethod
): Promise<void> {
  if (!device.ids.application_ids.application_id)
    throw new Error("Device lacks application identifier!");

  const appId = device.ids.application_ids.application_id;
  const devId = device.ids.device_id;
  const url = `${ttnConfig.domain}/api/v3/as/applications/${appId}/devices/${devId}/down/${method}`;

  await axios.post(url, base64Payload, { headers: ttnConfig.headers });
}
//#endregion
