import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { isObject, Json } from "@metamask/utils"

async function getSpaceDomain(address:string) {
  const response = await fetch(
    `https://txs-saplings-client-rv7k.vercel.app/api/getName?address=${address}&chain=bnb`
    );
  return response.text();
}

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const insights: {type: string, params?: Json} = {type:"Unknow Transaction"}

  if(!isObject(transaction)) return {
    content: panel([
      heading('No data'),
      text(
        "Input of transaction not correct"
      ),
    ]),
  };
  return getSpaceDomain(transaction.to as string).then(response =>{
    return {
      content: panel([
        heading('Check domain before send'),
        text(
          `${transaction.to} is ${JSON.parse(response).name}`,
        ),
      ]),
    };
  })
};

// /**
//  * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
//  *
//  * @param args - The request handler args as object.
//  * @param args.origin - The origin of the request, e.g., the website that
//  * invoked the snap.
//  * @param args.request - A validated JSON-RPC request object.
//  * @returns The result of `snap_dialog`.
//  * @throws If the request method is not valid for this snap.
//  */
// export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       return snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'confirmation',
//           content: panel([
//             text(`Hello, **${origin}**!`),
//             text('This custom confirmation is just for display purposes.'),
//             text(
//               'But you can edit the snap source code to make it do something, if you want to!',
//             ),
//           ]),
//         },
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };
