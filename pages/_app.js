import React from "react";
import App from "next/app";
import Head from "next/head";

// ------ global nav
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
/* ===== [ADDED] route-change indicator imports (minimal diff) ===== */
import Router from "next/router";
import { useNProgress } from "@tanem/react-nprogress";
/* ===== [ADDED END] ===== */

import "@ant-design/v5-patch-for-react-19";
// ------ global nav
import "antd/dist/reset.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "styles/custom_bootstrap_styles.scss";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-tooltip/dist/react-tooltip.css";
import "styles/custom_react-tooltip.css";
import "styles/index.css";
import { getCookie } from "lib/api/SERVER";

const AuthNav = dynamic(() => import("@centrawindows-ca/authnav"), {
  ssr: false, // This will prevent server-side render
});

const APP_TITLE = {
  Invoice: "Invoice Management",
  Production: "Order Management",
};

/* ===== [ADDED] very small progress bar component (uses @tanem/react-nprogress) ===== */
function TopProgressBar({ isAnimating }) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  const containerStyle = {
    pointerEvents: "none",
    position: "fixed",
    top: 0,
    left: 0,
    height: 2,
    width: "100%",
    zIndex: 99998,
    opacity: isFinished ? 0 : 1,
    transition: `opacity ${animationDuration}ms linear`,
  };

  const barStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: 2,
    width: `${progress * 100}%`,
    // keep color consistent with your Bootstrap primary
    backgroundColor: "#005db9",
    transition: `width ${animationDuration}ms ease-out`,
    zIndex: 99999,
  };

  return (
    <div style={containerStyle} aria-hidden="true">
      <div style={barStyle} />
    </div>
  );
}
/* ===== [ADDED END] ===== */

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      permissions: {},
      rawAuth: {},
      /* ===== [ADDED] flag for route-change progress ===== */
      isRouting: false,
      /* ===== [ADDED END] ===== */
    };
  }

  componentDidMount() {
    let comment = document.createComment(`
=========================================================
* Notus NextJS - v1.1.0 based on Tailwind Starter Kit by Creative Tim
=========================================================
* Product Page: https://www.creative-tim.com/product/notus-nextjs
* Copyright 2021 Creative Tim
* Licensed under MIT
* Tailwind Starter Kit Page: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
`);
    document.insertBefore(comment, document.documentElement);

    /* ===== [ADDED] bind Next Router events (minimal, cleans up on unmount) ===== */
    this._onStart = () => this.setState({ isRouting: true });
    this._onDone = () => this.setState({ isRouting: false });

    Router.events.on("routeChangeStart", this._onStart);
    Router.events.on("routeChangeComplete", this._onDone);
    Router.events.on("routeChangeError", this._onDone);
    /* ===== [ADDED END] ===== */
  }

  /* ===== [ADDED] ensure we remove listeners during HMR/unmount ===== */
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this._onStart);
    Router.events.off("routeChangeComplete", this._onDone);
    Router.events.off("routeChangeError", this._onDone);
  }
  /* ===== [ADDED END] ===== */

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  handleLoaded = (p, rawAuth) => {
    this.setState((prevState) => ({
      ...prevState,
      permissions: p,
      rawAuth,
      APP_NAME: getCookie("APP_NAME"),
    }));
  };

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => children);
    const No_header = Component.no_header || false;
    const env = process.env.NEXT_PUBLIC_ENV || "";
    const title =
      (APP_TITLE[this.state.APP_NAME] || "Order Management") +
      (env && env !== "production" ? ` (${env})` : "");

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>{title}</title>
        </Head>

        {/* ===== [ADDED] render a thin top progress bar during in-app navigations ===== */}
        <TopProgressBar isAnimating={this.state.isRouting} />
        {/* ===== [ADDED END] ===== */}

        <div className="main_wrapper">
          <ComAuthNav onLoaded={this.handleLoaded} noheader={No_header}/>

          <Layout
            permissions={this.state.permissions}
            rawAuth={this.state.rawAuth}
          >
            <Component {...pageProps} permissions={this.state.permissions} />
          </Layout>
        </div>
      </React.Fragment>
    );
  }
}

const ComAuthNav = ({ onLoaded, noheader }) => {
  const router = useRouter();
  const handleOnRoute = (path) => router.push(path);

  const handleAction = (type, permissions, rawdata, token) => {
    if (type === "LOADED") {
      onLoaded(permissions, rawdata);
      // persist user email for other parts of the app
      localStorage.setItem("user_email", rawdata?.email || "");
    }
  };

  return (
    <AuthNav
      options={{
        zIndex: 999999,
        onRoute: handleOnRoute, // relative in-app routes only
        onAction: handleAction,
        appCode: "OM",
        isExternal: false,
        isHideHeader: noheader,
        clientURL: "https://production.centra.ca",
      }}
      activeFeature="om.prod"
    />
  );
};
