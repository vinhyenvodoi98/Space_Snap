import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { isObject, Json } from "@metamask/utils"

async function getSpaceDomain() {
  const response = await fetch(`http://localhost:8000/api/getName?address=0x2e552E3aD9f7446e9caB378c008315E0C26c0398&chain=bnb`);
  return response.text();
}


export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const insights: {type: string, params?: Json} = {type:"Unknow Transaction"}

  if(!isObject(transaction)) return {insights}
  console.log(transaction)
  return getSpaceDomain().then(name =>{
    return snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          text(`Hello, **${origin}**!`),
          text(`SpaceId: ${name}`),
        ]),
      }
    });
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
