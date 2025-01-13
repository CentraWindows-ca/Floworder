import { GeneralProvider } from "lib/provider/GeneralProvider";
import LoadingBar from "components/atom/LoadingBar";

export default function Admin({ children, permissions, rawAuth }) {
    return (
      <GeneralProvider {...{permissions, rawAuth}} >
        <LoadingBar/>
        { children }
      </GeneralProvider>
    );
  }
  