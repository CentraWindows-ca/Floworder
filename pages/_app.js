import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { createRoot } from "react-dom/client";

// ------ global nav
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// ------ global nav

import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
// import "styles/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

import "react-tooltip/dist/react-tooltip.css";
import "styles/custom_react-tooltip.css";
import "styles/custom_bootstrap_styles.css"
import "styles/index.css";

const AuthNav = dynamic(() => import("@centrawindows-ca/authnav"), {
  ssr: false, // This will prevent server-side render
});

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);

  // note: update to satisfy React v18
  window.root = createRoot(document.getElementById("page-transition"));

  // note: its annoying
  // window.root.render(<PageChange path={url} />);

  // document.body.classList.add("body-page-transition");
  // ReactDOM.render(
  //   <PageChange path={url} />,
  //   document.getElementById("page-transition")
  // );
});
Router.events.on("routeChangeComplete", () => {
  window.root.unmount();

  // ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  // ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));

  window.root.unmount();
  document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      permissions: {},
      rawAuth: {}
    };
  }

  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* Notus NextJS - v1.1.0 based on Tailwind Starter Kit by Creative Tim
=========================================================

* Product Page: https://www.creative-tim.com/product/notus-nextjs
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md)

* Tailwind Starter Kit Page: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  handleLoaded = (p, rawAuth) => {
    this.setState(prevState => ({
      ...prevState,
      permissions: p,
      rawAuth
    }));
  }

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => children);
    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Centra Floworder{process.env.NEXT_PUBLIC_ENV !== 'production' ? ` (${process.env.NEXT_PUBLIC_ENV})`:''}</title>
        </Head>
        <div className="main_wrapper">
          <ComAuthNav onLoaded={this.handleLoaded} />
          <Layout permissions={this.state.permissions} rawAuth={this.state.rawAuth}>
            <Component {...pageProps} permissions={this.state.permissions} />
          </Layout>
        </div>
      </React.Fragment>
    );
  }
}

const ComAuthNav = ({ onLoaded }) => {
  const router = useRouter();
  // const handleOnRoute = async (path, feature) => {
  //   await router.push(path);
  //   console.log("its new page", feature)
  //   return true
  // };

  const handleOnRoute = (path) => router.push(path);

  const handleAction = (type, permimssions, rawdata, token) => {
    if ((type = "LOADED")) {
      onLoaded(permimssions, rawdata);
      console.log(type, permimssions, rawdata);
    }
  };

  return (
    <AuthNav
      options={{
        zIndex: 999,
        onRoute: handleOnRoute,
        onAction: handleAction,
        appCode: "DF",
        isExternal: false,
        // baseURL: "https://vgtest.centra.ca"
        // isLocalAppOnly: true
        // defaultList: DEFAULT_MENU,
      }}

    ></AuthNav>
  );
};
