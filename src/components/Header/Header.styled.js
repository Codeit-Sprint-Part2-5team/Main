import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderLayout = styled.header`
  display: flex;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #EDEDED;
`;

export const LogoBox = styled.h1`
  width: fit-content;
`;

export const LinkBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 19px;
  font-weight: 700;
  color: #4A494F;
`;
