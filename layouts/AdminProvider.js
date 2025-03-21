import { GeneralProvider } from "lib/provider/GeneralProvider";
import { InterruptProvider } from "lib/provider/InterruptProvider";
import LoadingBar from "components/atom/LoadingBar";
import constants from "lib/constants";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";

export default function Admin({ children, permissions, rawAuth }) {
  return (
    <GeneralProvider {...{ permissions, rawAuth }}>
      <LoadingBar />

      <ConfigProvider
        theme={{
          token: {
            borderRadius: 3,
            colorPrimary: constants.COLORS.centraBlue,
          },
          components: {
            Button: {
              colorPrimary: constants.COLORS.centraBlue,
              colorText: constants.COLORS.centraBlue,
            },
            Switch: {
              colorPrimary: constants.COLORS.centraBlue,
            },
            Table: {
              rowHoverBg: constants.COLORS.centraBlueLightest,
              colorText: constants.COLORS.centraDark,
              rowExpandedBg: constants.COLORS.centraBlueLightest,
            },
            Segmented: {
              itemSelectedBg: constants.COLORS.centraBlue,
              itemSelectedColor: constants.COLORS.centraWhite,
              trackBg: "#FFFFFF",
            },
          },
        }}
      >
        <StyleProvider>
          <InterruptProvider>{children}</InterruptProvider>
        </StyleProvider>
      </ConfigProvider>
    </GeneralProvider>
  );
}
