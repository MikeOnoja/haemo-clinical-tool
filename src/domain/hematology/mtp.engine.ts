export interface MTPInput {
  weight: number;
  activeBleeding: boolean;
  trauma: boolean;
  obstetric: boolean;
  hb: number;
}

export interface MTPResult {
  pack: string;
  rbcUnits: number;
  ffpUnits: number;
  plateletUnits: number;
  cryoUnits: number;
  message: string;
}

export function calculateMTP(input: MTPInput): MTPResult {
  const severity =
    (input.activeBleeding ? 2 : 0) +
    (input.trauma ? 2 : 0) +
    (input.obstetric ? 2 : 0) +
    (input.hb < 7 ? 1 : 0);

  if (severity >= 4) {
    return {
      pack: "MTP ACTIVATED - MASSIVE BLEEDING PROTOCOL",
      rbcUnits: 6,
      ffpUnits: 6,
      plateletUnits: 1,
      cryoUnits: 10,
      message: "Activate full MTP pack 1 immediately",
    };
  }

  if (severity >= 2) {
    return {
      pack: "MTP STANDBY",
      rbcUnits: 3,
      ffpUnits: 3,
      plateletUnits: 1,
      cryoUnits: 5,
      message: "Prepare blood products, monitor closely",
    };
  }

  return {
    pack: "NO MTP REQUIRED",
    rbcUnits: 0,
    ffpUnits: 0,
    plateletUnits: 0,
    cryoUnits: 0,
    message: "Supportive care only",
  };
}