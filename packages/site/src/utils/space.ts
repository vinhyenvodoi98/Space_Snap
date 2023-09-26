export const getBalanceOf = async ( address: string, contract: any ) => {
  try {
    console.log(address)
    const balance = await contract.methods.balanceOf(address).call({from: address});
    return balance;
  } catch (error) {
    return error;
  }
};
