import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";

import Framework_Invoice from "components/organism/Invoice_Framework";

// hooks
import useDataInit from "lib/hooks/useDataInit";
import useOrderListPermission from "lib/permissions/useOrderListPermission";

// styles
import styles from "./styles.module.scss";

const Com = ({}) => {
  const router = useRouter();

  const endPoint = ''
  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  const handleRefresh = () => {
    mutate(null);
  };

  // ====== consts
  return (
    <Framework_Invoice onRefresh={handleRefresh}>
      hi this is remake
    </Framework_Invoice>
  );
};

export default Com;
