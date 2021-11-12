import { FeePrice } from '../types';
import apis from '../api';

export const setFees = (nativeFee: number, roe: number) => {
  const fee: FeePrice = {
    nativeFio: null,
    costFio: null,
    costUsdc: null,
  };
  fee.nativeFio = nativeFee;
  fee.costFio = apis.fio.sufToAmount(fee.nativeFio);
  if (fee.nativeFio && roe) {
    fee.costUsdc = apis.fio.convert(fee.nativeFio, roe);
  }

  return fee;
};
