import React from "react";

// components
import ComPage from "components/template/Page_Remake"

// layout for page
import AdminProvider from "layouts/AdminProvider";
import AdminLayout from "layouts/AdminLayout";


export default function Page(props) {
  return (
    <AdminLayout>
      {/* this dashboard is devs-only */}
      <ComPage {...props}/>
    </AdminLayout>
  );
}

Page.layout = AdminProvider;
