import { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import Table from '../components/Table';
import Search from '../components/Search';
import { getBalanceOf, getTokenOfOwnerByIndex } from '../utils/space';
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
  const titles = [
    { key: 'image', title: 'Image' },
    { key: 'name', title: 'Domain' },
    { key: 'prize', title: 'Prize' },
    { key: 'expiration', title: 'Expiration Day' },
    { key: 'key5', title: 'Send' },
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [balance, setBalance] = useState('')
  const [spaceNfts, setSpaceNfts] = useState<any>([])
  const [inputType, setInputType] = useState<InputType | null>(null)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const getBalance = async () => {
      const bl = await getBalanceOf(searchTerm, state.contract);
      setBalance(bl)
      if(isValidEthereumAddress(searchTerm)){
        setInputType(InputType.address)
        const {nfts} = await apiOpenseaCall({url:`chain/bsc/account/${searchTerm}/nfts?limit=50`})
        const spaceNfts = filterSpaceNFT(nfts);
        setSpaceNfts(spaceNfts)
      }

      if(endsWithBnb(searchTerm)){
        setInputType(InputType.bnb)
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
        {!!inputType ? inputType === InputType.address
          ?
            <Table titles={titles} columns={spaceNfts}/>
          :
            <Send domain={searchTerm} chain={inputType as string} />
          :<></>
        }
      </CardContainer>
    </Container>
  );
};

export default Index;

{/* {shouldDisplayReconnectButton(state.installedSnap) && (
  <Card
    content={{
      title: 'Reconnect',
      description:
        'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
      button: (
        <ReconnectButton
          onClick={handleConnectClick}
          disabled={!state.installedSnap}
        />
      ),
    }}
    disabled={!state.installedSnap}
  />
)}
<Card
  content={{
    title: 'Send Hello message',
    description:
      'Display a custom message within a confirmation screen in MetaMask.',
    button: (
      <SendHelloButton
        onClick={handleSendHelloClick}
        disabled={!state.installedSnap}
      />
    ),
  }}
  disabled={!state.installedSnap}
  fullWidth={
    isMetaMaskReady &&
    Boolean(state.installedSnap) &&
    !shouldDisplayReconnectButton(state.installedSnap)
  }
/> */}