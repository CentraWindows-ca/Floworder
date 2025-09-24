import React from "react";

// components
import Invoice from "components/template/Invoice"

// layout for page
import AdminProvider from "layouts/AdminProvider";
import AdminLayout from "layouts/AdminLayout";


export default function Page(props) {
  return (
    <AdminLayout>
      {/* this dashboard is devs-only */}
      <Invoice {...props}/>
    </AdminLayout>
  );
}

Page.layout = AdminProvider;
