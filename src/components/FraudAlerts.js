import React from "react";
import { Page, Card, DataTable } from "@shopify/polaris";

const mockOrders = [
  ["#1234", "2024-07-01", "High", "Blocked"],
  ["#1235", "2024-07-02", "Medium", "Reviewed"],
  ["#1236", "2024-07-03", "High", "Blocked"],
];

function FraudAlerts() {
  return (
    <Page title="Fraud Alerts">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Order ID", "Date", "Risk Level", "Status"]}
          rows={mockOrders}
        />
      </Card>
    </Page>
  );
}

export default FraudAlerts;
