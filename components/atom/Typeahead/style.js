import styled from "styled-components";

const scom = (com) => styled(com)`
  /* css here */
  &.sm .dropdown-menu {
    min-width: 180px;
    .dropdown-item {
      font-size: 0.85rem;
    }
  }
`;

export default scom;
