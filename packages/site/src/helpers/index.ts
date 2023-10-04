import Web3 from "web3";
import { BscContractAddress } from "../config/spaceId";

export function isValidEthereumAddress(address: string): boolean {
	const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
	return ethereumAddressRegex.test(address);
}

interface OpenseaNFTObject {
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
}

export function filterSpaceNFT(objects: OpenseaNFTObject[]): OpenseaNFTObject[] {
	return objects.filter(obj => obj.contract.toLocaleLowerCase() === BscContractAddress.toLocaleLowerCase());
}

export function endsWithBnb(inputString: string): boolean {
	const regex = /\.bnb$/;
	return regex.test(inputString);
}

export function endsWithArb(inputString: string): boolean {
	const regex = /\.arb$/;
	return regex.test(inputString);
}

export function weiToEth(web3:Web3, weiAmount: string): string {
  const ethAmount = web3.utils.fromWei(weiAmount, 'ether');
  return ethAmount;
}
