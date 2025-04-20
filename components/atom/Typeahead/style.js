import styled from "styled-components";

const scom = (com) => styled(com)`
  /* css here */
  &.sm .dropdown-menu {
    min-width: 180px;
    .dropdown-item {
      font-size: 0.85rem;
    }
  }

  &.root {
    .rbt-input-main {
      padding-right: 30px !important;
    }
  }
`;

export default scom;
