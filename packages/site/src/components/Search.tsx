import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { SearchIcon } from './Icon/SearchIcon';

interface SearchProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = styled.input`
  padding: 10px;
  border: 0;
  width: 100%;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
  color: ${(props) => props.theme.colors.text.default};
`;

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4rem 0;
  cursor: pointer;
`

const SearchWrap = styled.div`
  padding: 0 10px;
  border: 1px solid ;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
`

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <SearchContainer>
      <SearchWrap>
        <SearchInput
          type="text"
          placeholder="Search"
          value={value}
          onChange={onChange}
        />
        <SearchIcon />
      </SearchWrap>
    </SearchContainer>
  );
};

export default Search;
