import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ExternalLinkIcon } from './Icon/Common';

interface ExternalLinkProps {
  url: string;
}

const LinkWrapper = styled.a`
  display: inline-block;
  text-decoration: none;
  color: #007bff;
`;

const ExternalIcon = styled.span`
  margin-left: 4px;
`;

const ExternalLink: React.FC<ExternalLinkProps> = ({ url }) => {
  const theme = useTheme();
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <LinkWrapper href={url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
      <ExternalLinkIcon color={theme.colors.icon.default} size={25}/>
    </LinkWrapper>
  );
};

export default ExternalLink;
