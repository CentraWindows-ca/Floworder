import React from "react";

// components
import ComPage from "components/template/Page_OrderEdit";

// layout for page
import AdminProvider from "layouts/AdminProvider";
import AdminLayout from "layouts/AdminLayout";

export default function Page(props) {
  return (
    <AdminLayout>
      {/* this dashboard is devs-only */}
      <ComPage
        {...props}
        display_sections={{
          addons: false,
          summary: false,
          notes: false,
          returnTrips: false,
          images: false,
          files: false,
          productionItems: false,
          glassItems: false,
          history: false,
        }}
      />
    </AdminLayout>
  );
}

Page.layout = AdminProvider;
Page.no_header = true;
