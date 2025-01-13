import React from "react";

// components
import Orders from "components/template/Orders"

// layout for page
import AdminProvider from "layouts/AdminProvider";
import AdminLayout from "layouts/AdminLayout";


export default function Page(props) {
  return (
    <AdminLayout>
      {/* this dashboard is devs-only */}
      <Orders {...props}/>
    </AdminLayout>
  );
}

Page.layout = AdminProvider;
