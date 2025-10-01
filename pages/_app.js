import React, { useState } from "react";
import App from "next/app";
import Head from "next/head";

// ------ global nav
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import "@ant-design/v5-patch-for-react-19";
// ------ global nav
import "antd/dist/reset.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
// import "styles/tailwind.css";
import "styles/custom_bootstrap_styles.scss";
// import "bootstrap/dist/css/bootstrap.min.css";

import "react-bootstrap-typeahead/css/Typeahead.css";

import "react-tooltip/dist/react-tooltip.css";
import "styles/custom_react-tooltip.css";

import "styles/index.css";

const AuthNav = dynamic(() => import("@centrawindows-ca/authnav"), {
  ssr: false, // This will prevent server-side render
});

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      permissions: {},
      rawAuth: {},
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
    this.setState((prevState) => ({
      ...prevState,
      permissions: p,
      rawAuth,
    }));
  };

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => children);
    const title =
      "Order Management" + (process.env.NEXT_PUBLIC_ENV !== "production"
        ? ` (${process.env.NEXT_PUBLIC_ENV})`
        : "");
    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>{title}</title>
        </Head>
        <div className="main_wrapper">
          <ComAuthNav onLoaded={this.handleLoaded} />
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

const ComAuthNav = ({ onLoaded }) => {
  const router = useRouter();
  // const handleOnRoute = async (path, feature) => {
  //   await router.push(path);
  //   console.log("its new page", feature)
  //   return true
  // };

  const handleOnRoute = (path) => router.push(path);

  const handleAction = (type, permissions, rawdata, token) => {
    if ((type === "LOADED")) {
      onLoaded(permissions, rawdata);
      console.log(type, permissions, rawdata);
      localStorage.setItem("user_email", rawdata?.email);
    }
  };

  return (
    <AuthNav
      options={{
        zIndex: 999999,
        onRoute: handleOnRoute,
        onAction: handleAction,
        appCode: "OM",
        isExternal: false,
        clientURL: "https://production.centra.ca",
        // isLocalAppOnly: true
        // defaultList: DEFAULT_MENU,
      }}
      activeFeature="om.prod"
    ></AuthNav>
  );
};
