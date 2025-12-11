# Crownsync AI Platform Prototype Documentation

## 1. Overview

This document outlines the structure and navigation of the Crownsync AI platform prototype based on the version available at [https://crownsync-app-prototype.vercel.app/](https://crownsync-app-prototype.vercel.app/).

The prototype represents the target state for the application, and current development efforts (such as the "Brand View" campaign performance features) will be integrated into this structure.

## 2. Main Navigation Structure

The platform uses a left-hand sidebar for main navigation. The primary sections are:

1.  **Dashboard**:
    *   **Status**: Currently displays a "Coming Soon" message.
    *   **Purpose**: This is the anticipated location for "Brand View" features, including the "Campaign Performance" dashboard currently under development in the codebase (`app/(dashboard)/dashboard/brand-performance`).

2.  **Partner Hub**:
    *   **Overview**: General partner network overview.
    *   **Campaigns**: Management of marketing campaigns for the partner network. (See Section 3.1 for details).
    *   **Resources**: Sharing of marketing assets and resources with partners.
    *   **Tasks**: Management of tasks assigned to or required from partners.
    *   **Retailers**: Database and management of retailer partners.

3.  **Direct Marketing**:
    *   Tools and features for direct-to-consumer marketing activities.

4.  **Assets**:
    *   Digital Asset Management (DAM) system for storing and organizing brand assets.

5.  **Analytics**:
    *   Comprehensive platform-wide analytics and reporting.

6.  **Settings**:
    *   Configuration for user profile, organization, and platform preferences.

## 3. Key UI Flows and Page Content

### 3.1. Partner Hub > Campaigns

This section is a core part of the prototype, designed for managing campaigns distributed through the partner network.

*   **Header**:
    *   Title: "Campaigns"
    *   Action: "New Campaign" button to initiate the campaign creation flow.

*   **Performance Overview**:
    *   A dashboard section providing high-level metrics.
    *   **Tabs**:
        *   **Overview Numbers**: Key Performance Indicators (KPIs) such as:
            *   Active Campaigns
            *   Avg. Adoption Rate
            *   Total Consumer Reach
            *   Avg. Engagement Rate
            *   (Includes percentage change indicators for each metric).
        *   **Trend Visualization**: A chart area for visualizing performance trends over time.

*   **Campaign List**:
    *   **Filters**: Tab-based filtering by campaign status:
        *   All
        *   Active
        *   Draft
        *   Scheduled
        *   Ended
        *   Archived
        *   (Each filter shows a count of campaigns).
    *   **Search & Sort**:
        *   Search bar for finding campaigns by name.
        *   Sort dropdown (defaulting to "Newest Created").
    *   **View Toggle**: Options to switch between Grid View (cards) and List View (table).
    *   **Campaign Cards (Grid View)**:
        *   **Status Badge**: Visual indicator of campaign status (e.g., "Active", "Ended").
        *   **Campaign Info**: Name and thumbnail image.
        *   **Timeline**: Date range of the campaign.
        *   **Metrics**:
            *   Adoption Rate (%)
            *   Uses (count)
        *   **Platforms**: Icons indicating supported platforms (e.g., Facebook, Instagram, X).

### 3.2. Brand View Integration (Future State)

The current codebase implements "Brand View" features under `app/(dashboard)/dashboard/brand-performance`. In the prototype's structure:

*   **Location**: These features are expected to reside under the **Dashboard** section.
*   **Content**: The "Campaign Performance" dashboard (including Trend Analysis, Platform Performance, and Retailer Network) will likely become a sub-view or a detailed view within the Dashboard or linked from the Campaigns list.

## 4. User Profile

*   **Location**: Bottom of the sidebar.
*   **Details**: Displays the current user's name (e.g., "Luxury Boutique") and role (e.g., "Brand Admin").
