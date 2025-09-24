import React from "react";

// components
import ProfileLookup from "components/template/ProfileLookup"

// layout for page
import AdminProvider from "layouts/AdminProvider";
import AdminLayout from "layouts/AdminLayout";


export default function Page(props) {
  return (
    <AdminLayout>
      {/* this dashboard is devs-only */}
      <ProfileLookup {...props}/>
    </AdminLayout>
  );
}

Page.layout = AdminProvider;
