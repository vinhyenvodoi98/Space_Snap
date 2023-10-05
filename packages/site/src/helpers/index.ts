import { BscContractAddress } from '../config/spaceId';

export function isValidEthereumAddress(address: string): boolean {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/u;
  return ethereumAddressRegex.test(address);
}

type OpenseaNFTObject = {
  collection: string;
  contract: string;
  created_at: string;
  description: string;
  identifier: string;
  image_url: string;
  is_disabled: string;
  is_nsfw: string;
  metadata_url: string;
  name: string;
  token_standard: string;
  updated_at: string;
};

export function filterSpaceNFT(
  objects: OpenseaNFTObject[],
): OpenseaNFTObject[] {
  return objects.filter(
    (obj) =>
      obj.contract.toLocaleLowerCase() ===
      BscContractAddress.toLocaleLowerCase(),
  );
}

export function endsWithBnb(inputString: string): boolean {
  const regex = /\.bnb$/u;
  return regex.test(inputString);
}

export function endsWithArb(inputString: string): boolean {
  const regex = /\.arb$/u;
  return regex.test(inputString);
}

export function weiToEth(weiAmount: string): string {
  const ethAmount = Number(weiAmount) / Math.pow(10, 18);
  return ethAmount.toString();
}
