import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { sendTransaction } from '../utils';

interface SendProps {
  domain: string;
  chain: string;
}

const SendContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background.alternative};
`;

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

const Send: React.FC<SendProps> = ({ domain, chain }) => {
  const [,dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState<string>("")

  const handleSendClick = async () => {
    try {
      await sendTransaction();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  useEffect(() => {
    const convertDomain = async() => {
      fetch(`/api/getAddress?domain=${domain}&chain=${chain}`) // Đường dẫn đến API
        .then(response => response.json())
        .then(data => setAddress(data.address))
        .catch(error => console.error('Error:', error))
    }

    convertDomain()
  }, [domain,chain])

  return (
    <SendContainer>
      <div>
        {address}
      </div>
      <StyledButton onClick={handleSendClick}>Send</StyledButton>
    </SendContainer>
  );
};

export default Send;
