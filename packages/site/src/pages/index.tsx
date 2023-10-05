import { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import Table from '../components/Table';
import Search from '../components/Search';
import { endsWithArb, endsWithBnb, filterSpaceNFT, isValidEthereumAddress } from '../helpers';
import apiOpenseaCall from '../utils/opensea';
import Send from '../components/Send';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 100rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

export enum InputType {
  bnb = 'bnb',
  arb = 'arb',
  address = 'address',
}

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [titles, setTitle] = useState([
    { key: 'image', title: 'Image' },
    { key: 'name', title: 'Domain' },
    { key: 'prize', title: 'Prize' },
    { key: 'expiration', title: 'Expiration Day' },
    { key: 'send', title: 'Send' },
  ])

  const [searchTerm, setSearchTerm] = useState('');
  const [spaceNfts, setSpaceNfts] = useState<any>([])
  const [inputType, setInputType] = useState<InputType | null>(null)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const convertDomain = async(domain:string, chain:string) => {
    const response = await fetch(`/api/getAddress?domain=${domain}&chain=${chain}`)
    const data = await response.json()
    return data.address
  }

  useEffect(() => {
    const getBalance = async () => {
      if(isValidEthereumAddress(searchTerm)){
        setInputType(InputType.address)
        const {nfts} = await apiOpenseaCall({url:`chain/bsc/account/${searchTerm}/nfts?limit=50`})
        const spaceNfts = filterSpaceNFT(nfts);
        setSpaceNfts(spaceNfts)
      }

      if(endsWithBnb(searchTerm)){
        setInputType(InputType.bnb)
        setTitle(prevTitles => {
          return prevTitles.map(item => {
            if (item.key === 'name') {
              return { ...item, title: 'Owner' };
            }
            return item;
          });
        });
        const address = await convertDomain(searchTerm, 'bnb')
        const {nfts} = await apiOpenseaCall({url:`chain/bsc/account/${address}/nfts?limit=50`})
        const spaceNfts = filterSpaceNFT(nfts);
        const filterByName = spaceNfts.filter(nft => nft.name === searchTerm)
        filterByName[0].name = address
        setSpaceNfts(filterByName)
      }

      if(endsWithArb(searchTerm)){
        setInputType(InputType.arb)
      }
    }

    if(searchTerm.length > 0) {
      getBalance()
    }
  }, [searchTerm])

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Space Snap</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        <Search value={searchTerm} onChange={handleSearch} />
        {!!inputType
          ?
            <Table titles={titles} columns={spaceNfts}/>
          :<></>
        }
      </CardContainer>
    </Container>
  );
};

export default Index;
