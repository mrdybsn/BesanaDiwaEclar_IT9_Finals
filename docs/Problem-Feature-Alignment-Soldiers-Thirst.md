# Soldier's Thirst — Problem–Solution Alignment Document

**Project:** Web-Based Water Refilling Station Management System  
**Client:** Soldier's Thirst (Roxas City)  
**System scope (current build):** Admin Portal + Rider Portal  
**Date:** May 24, 2026  

---

## 1. Instructor Requirement (Alignment Rule)

> Present problems in bullet points on printed paper. Present solutions on **both** printed paper **and** the web application. **Every solution written on paper must be visible and demonstrable in the web app.**

This document maps client problems → planned solutions → what is **actually built** in the current system, so you can defend alignment during defense and print it as your paper appendix.

---

## 2. Executive Summary — Are We Aligned?

| Verdict | Detail |
|--------|--------|
| **Overall** | **Mostly aligned** with the client's operational pain points and your core Problem–Feature Mapping, **within the Admin + Rider scope**. |
| **Strong fit** | Jug/container debt, digital orders (walk-in vs delivery), recurring (standing) orders, inventory & low-stock alerts, rider delivery workflow, cash collection → remittance verification, customer & product records, reports. |
| **Partial fit** | Sales/profit visibility, neighborhood analytics, address/landmark help, refill vs new-container reporting, dispute evidence for jugs. |
| **Not in current app** | Filter life by gallons sold, **customer self-service order tracking**, live GPS shared to customers, full monthly P&L (profit minus expenses). |
| **Scope note** | Customer and Cashier portals were **removed due to time** and documented as **future recommendations** — this explains gaps where the original plan assumed customer-facing features. |

**Bottom line for defense:** Your paper should list only solutions you can **click and show** in Admin or Rider. Do not claim customer live tracking or filter-life progress bars unless you add them or label them as *Future Work*.

---

## 3. Client Discovery — Problems (Bullet Points for Printed Paper)

Use this section verbatim or shortened on your printed problem statement:

- **Manual logbook tracking** — Walk-in gallons, delivery gallons, and borrowed blue jugs are written by hand; entries are incomplete or lost over time.
- **Jug debt / asset loss** — Cannot reliably track who owes empty 5-gallon containers; customers sometimes forget to return jugs.
- **Inventory surprises** — Caps, seals, stickers, and supplies are tracked on paper; stock-outs happen unexpectedly.
- **Standing orders forgotten** — Weekly schedules (e.g., every Monday/Friday) rely on memory and manual notes.
- **Address & landmark gaps** — Orders come by text with incomplete location details; riders get lost.
- **Remittance cannot be verified** — Cash collected per delivery is hard to reconcile with what the rider should remit.
- **Double-booking / missed deliveries** — Manual recording causes scheduling conflicts and missed runs.
- **No self-service tracking** — Customers must call to ask where their order is.
- **Weak business insight** — Hard to see which areas order most, total monthly profit, and daily sales vs expenses without long manual calculation.
- **Refill vs new container** — Hard to separate refill-only sales from new-container sales in daily records.
- **Inactive “Suki” customers** — No systematic way to spot regular customers who stopped ordering.
- **Jug return disputes** — No authoritative digital record when a customer claims they returned a jug.
- **Filter maintenance guesswork** *(from original questionnaire)* — No volume-based reminder for when to replace water filters.

---

## 4. Planned Solutions (Problem–Feature Mapping) vs Web App

### 4.1 Core mapping from your project plan

| Core problem (plan) | Planned solution (paper) | Web app feature / module | Alignment |
|---------------------|--------------------------|---------------------------|-----------|
| Jug debt / asset loss | Digital Container Ledger | **Gallon Debts** (`/admin/gallon-debts`); jug fields on POS/delivery orders (`gallon_owned`, `gallon_exchange`); auto debt via `GallonDebtService` | ✅ **Implemented** |
| Maintenance guesswork | Water Volume Tracker (filter life from gallons sold) | **Admin Analytics** page shows sample charts only — **not connected to real gallon/filter data** | ❌ **Not implemented** (list as future work) |
| Logistics friction | Rider GPS & live customer status | **Rider Map** (`/rider/map`), geocoded addresses, delivery status in admin | ⚠️ **Partial** — rider/admin yes; **customer live tracking removed** |
| Manual remittance errors | Rider Remittance Module | **Remittances** (`/admin/remittances`); auto-created on delivery collection; verify/discrepancy | ✅ **Implemented** |
| Stock-outs (caps, seals) | Low-stock alerts | **Dashboard** low-stock tables; **Inventory** module; **notifications** | ✅ **Implemented** |

### 4.2 Client questionnaire answers → system features

| Client problem (from interview) | Solution in web app | Where to demonstrate |
|--------------------------------|---------------------|----------------------|
| Manual log for walk-in vs delivery gallons | Digital orders with `order_type`: walk-in / delivery | **POS** (walk-in), **Orders** tabs: Walk-in \| Delivery \| Recurring |
| Manual blue jug tracking | Per-customer gallon debt ledger | **Gallon Debts**, order jug exchange fields |
| Customers don't return jugs / can't track debt | Borrowed vs returned gallons per customer | **Gallon Debts** list, dashboard total debt in analytics API |
| Written inventory for seals/caps/stickers | Inventory items with quantities & thresholds | **Inventory** (`/admin/inventory`), dashboard **Inventory supplies low stock** |
| Standing orders (Mon/Fri, etc.) | Recurring orders | **Orders → Recurring** tab (redirect from `/admin/recurring`) |
| Rider can't find address | Address + map geocoding | Customer address on delivery; **AddressGeocoder**; **Rider Map** |
| Track rider cash / verify remit | Collection on deliver → remittance row → admin verify | **Rider Collection**, **Remittances** verify modal |
| Double-booking / missed delivery | Central order & delivery records | **Orders**, **Deliveries**, rider **My Tasks** |
| Which neighborhoods order most | Analytics by barangay/area | ⚠️ **Admin Analytics** uses **placeholder/mock data** — not live Roxas City breakdown |
| Low stock + jug debt alerts helpful | Notifications + dashboard | **Dashboard**, header **notifications** bell |
| Can't see monthly profit | Revenue reports | ⚠️ **Reports** (weekly revenue download); **Dashboard** daily sales — **not full expense/profit P&L** |
| Customer can't check status without calling | Customer portal tracking | ❌ **Removed** — admin/rider can see status; customer cannot log in |
| Refill vs new container in records | Product catalog distinguishes types | **Products** (e.g. “Purified Water — New Container” vs refill SKUs), **POS** line items |
| Suki who haven't ordered lately | Retention / inactive customer report | ⚠️ API has **top customers** only; **no “inactive X days” screen** |
| Jug return disputes | Digital transaction + debt history | ⚠️ **Partial** — order history + gallon debt; no formal “dispute” workflow |
| Landmarks for new riders | Landmark field on customer | ⚠️ **Partial** — address + geocode hints mention landmark; **no dedicated landmark column in UI** |
| Daily manual sales & expense totals | Automated daily summary | **Dashboard** walk-in/delivery/total sales for today; expenses not fully tracked |

---

## 5. What to Show During Defense (Demo Checklist)

Match each **solution on your printed paper** to a live click:

| # | Say on paper | Show in app |
|---|--------------|-------------|
| 1 | Digital jug ledger | Admin → **Gallon Debts**; create delivery order with jug exchange |
| 2 | Low-stock alerts | Admin → **Dashboard** (products + inventory tables); trigger notification |
| 3 | Inventory for caps/seals | Admin → **Inventory** |
| 4 | Walk-in vs delivery sales | Admin → **POS** + **Orders** (tabs) |
| 5 | Standing / weekly orders | Admin → **Orders → Recurring** |
| 6 | Rider finds address | Rider → **Map**; admin → **Deliveries** with address |
| 7 | Cash collection & remittance proof | Rider → **Collection** → Admin → **Remittances** → Verify |
| 8 | Assign delivery, avoid lost orders | Admin → **Deliveries** → Rider → **My Tasks** |
| 9 | Customer database | Admin → **Customers** |
| 10 | Sales reports | Admin → **Reports** (weekly download) |

**Do not demo** (unless marked future work on paper): filter life bars, customer order tracking portal, live GPS for customers, barangay heatmap from real data.

---

## 6. Scope Decision — Admin + Rider Only

| Original role | Status | Impact on alignment |
|---------------|--------|------------------------|
| **Admin** | ✅ Built | Covers operations, inventory, debts, remittances, reports |
| **Rider** | ✅ Built | Tasks, map, collection, schedule, lost items |
| **Customer** | ❌ Removed (future) | Explains gap: *“Can customers check delivery without calling?”* → **No** in current build |
| **Cashier** | ❌ Removed (future) | Admin **POS** replaces cashier walk-in sales |

**Recommended wording for paper:**  
*"Phase 1 delivers Admin and Rider modules that address the highest-frequency bottlenecks (orders, jugs, inventory, remittance, delivery). Customer self-service and Cashier views are recommended for Phase 2."*

---

## 7. Future Recommendations (for paper — not claimed as built)

1. **Customer portal** — order placement, live delivery status, jug balance view.  
2. **Cashier role** — dedicated POS station without full admin access.  
3. **Filter life module** — tie gallons sold to filter replacement schedule (progress bar).  
4. **Suki / inactive customer report** — customers with no order in 30/60/90 days.  
5. **Barangay / neighborhood analytics** — real data from customer addresses (not mock charts).  
6. **Dedicated landmark field** on customer profile for rider notes.  
7. **Profit & loss** — expense entry + monthly net profit dashboard.  
8. **Jug dispute log** — notes and resolution status when customer contests returns.

---

## 8. Alignment Scorecard (Quick Reference)

| Category | Score | Notes |
|----------|-------|-------|
| Jug / container management | 9/10 | Core strength of the system |
| Orders & recurring | 9/10 | Walk-in, delivery, recurring covered |
| Inventory & alerts | 8/10 | Supplies + product stock; notifications work |
| Rider operations & remittance | 9/10 | End-to-end collection → verify |
| Sales reporting | 6/10 | Revenue yes; profit/expenses incomplete |
| Logistics / GPS | 6/10 | Rider map yes; customer tracking no |
| Analytics / neighborhoods / Suki | 4/10 | Mock or missing features |
| Filter maintenance | 0/10 | Not built |
| Customer self-service | 0/10 | Portal removed |

**Weighted conclusion:** ~**75% aligned** with client operational problems for an **Admin+Rider MVP**; ~**90% aligned** if you only grade features you actually implemented and document the rest as Phase 2.

---

## 9. Suggested Printed Paper Structure

1. **Introduction** — Soldier's Thirst, manual logbook context  
2. **Problems** — Section 3 bullets  
3. **Proposed solutions** — Section 4.1 table (shortened)  
4. **Implementation** — Section 5 demo checklist + screenshots  
5. **Scope & limitations** — Section 6 + 7  
6. **Conclusion** — System reduces jug loss, stock-outs, and remittance errors; Phase 2 for customer tracking and filter analytics  

---

*Generated for IT9 Finals — Besana, Diwa, Eclar. Open this file in Word or browser and use **Print → Save as PDF** for submission.*
