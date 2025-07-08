import React from "react";
import { Page, Card, TextContainer, Layout } from "@shopify/polaris";

function SecurityInsights() {
  return (
    <Page title="Security Insights">
      <Layout>
        <Layout.Section>
          <Card title="Threats Blocked This Month" sectioned>
            <TextContainer>
              <h2>23</h2>
              <p>
                Fraud attempts, phishing emails, and suspicious logins blocked
                in July.
              </p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card title="Threats Over Time" sectioned>
            <div
              style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
              }}
            >
              [Chart Placeholder]
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default SecurityInsights;
