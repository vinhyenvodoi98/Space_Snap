import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { BscContractAddress } from '../config/spaceId';
import { weiToEth } from '../helpers';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { sendTransaction } from '../utils';
import apiOpenseaCall from '../utils/opensea';
import { apiMetadataCall } from '../utils/space';
import ExternalLink from './ExternalLink';

interface TableCellProps {
  width: string;
}

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background.alternative};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div<TableCellProps>`
  flex: ${({ width }) => width};
  padding: 8px 12px;
  text-align: center;

  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  align-items: center;
  margin: 1rem 0 0 0;
`;

const TableCell = styled.div<TableCellProps>`
  flex: ${({ width }) => width};
  text-align: center;
  padding: 8px 12px;
`;

const Divide = styled.div`
  width: 100%;
  height: 1px;
  background-color: #344b57a6;
`

const SpaceImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PrizeDiv = styled.div`
  width: 8rem;
`
const StyledButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary.default};
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #009c74; // Đổi màu khi hover
  }
`;

interface TableProps {
  titles: { key: string; title: string }[];
  columns: Record<string, any>[];
}

interface SpaceMetadata {
  name: string;
  image: string;
  attributes: any[];
}

interface OpenseaOrder {
  current_price: string;
}

const widthIndex = (titleIndex: Number) => {
  return titleIndex === 0
  ? '5%'
  : titleIndex === 1
  ? '40%'
  : titleIndex === 2
  ? '10%'
  : titleIndex === 3
  ? '10%'
  : '10%'
}

const TableRowComponent:React.FC<any> = ({column, titles}:any) => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [metadata, setMetadata] = useState<SpaceMetadata | null>(null)
  const [orders, setOrders] = useState<OpenseaOrder[]|[]>([])

  useEffect(() => {
    const getMetadata = async (id:string) => {
      const metadata = await apiMetadataCall({url:id})
      setMetadata(metadata as SpaceMetadata)

      const {orders} = await apiOpenseaCall({url:`orders/bsc/seaport/listings?asset_contract_address=${BscContractAddress}&token_ids=${id}&order_by=created_date&order_direction=desc`})
      setOrders(orders)
    }

    getMetadata(column.identifier)
  }, [column.identifier])

  const expirationDay = useMemo(() => {
    const timestamp = metadata?.attributes.filter( attribute => attribute.trait_type === "Expiration Date")[0].value
    const date = new Date(timestamp*1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = date.getDate();
    return `${year}-${month}-${day}`
  }, [metadata])

  const currentPrize = useMemo(() => {
    return orders.length > 0 ? `${weiToEth(orders[0].current_price)} BNB` : "Create Order"
  },[orders])

  const handleSendClick = async () => {
    try {
      await sendTransaction();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return(
    <TableRow>
      {titles.map((title: { key: string }, titleIndex: React.Key | null | undefined) => (
        <TableCell
          width={widthIndex(titleIndex as Number)}
          key={titleIndex}
        >
          {title.key === "image" ?
            <SpaceImage src={metadata?.image} alt="nft image"/>
            :
            title.key === "expiration" ?
            expirationDay
            :
            title.key === "prize" ?
            <Row>
              <PrizeDiv>{currentPrize}</PrizeDiv>
              <ExternalLink url={`https://opensea.io/assets/bsc/${BscContractAddress}/${column.identifier}`}/>
            </Row>
            : title.key === "name" ?
            <Row>
              {column[title.key]}
            </Row>
            : title.key === "send" ?
              <StyledButton onClick={handleSendClick}>Send</StyledButton>
            :
            column[title.key]
          }
        </TableCell>
        ))}
    </TableRow>
  )
}

const Table: React.FC<TableProps> = ({ titles, columns }) => {
  return (
    <TableContainer>
      <TitleContainer>
        {titles.map((title, index) => (
          <Column
            width={widthIndex(index as Number)}
            key={index}
          >
            {title.key === "name" ?
              <Row>{title.title}</Row>
            :
              title.title
            }
          </Column>
        ))}
        </TitleContainer>
      <Divide/>

      {columns.map((column, index) => (
        <TableRowComponent key={index} column={column} titles={titles}/>
      ))}
    </TableContainer>
  );
};

export default Table;
