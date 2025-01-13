import styled from "styled-components";

const scom = (com) => styled(com)`
  /* css here */
  &.root {
    .rbt-input-main {
      padding-right: 30px !important;
      width: fit-content !important;
      max-width: 100%
    }
    min-width: 100px !important
  }
`;

export default scom;
