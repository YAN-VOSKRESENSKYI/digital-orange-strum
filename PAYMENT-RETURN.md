# Payment return page

Unresolved payments use the existing /failed-payment design with paymentState=unverified.
Pending/hold/refund processing and provider outages are not proof of a failed charge.
The page offers server-side verification of the same order, or support without an ID.
Confirmed failures retain the new-payment action; Approved retains /t3nx-8291.
Verification preserves order/deal, variant and attribution. New-payment links remove
old order/deal IDs. The server strips stale presentation state before its new result.

Ported from katya-digital-vlob on this landing's prepared payment branch, retaining
its existing payment/CRM fixes, design, merchant configuration and support contact.
The complete prepared branch is pushed to the production branch after validation.

Validation: node --test test/payment-return-page.test.js; React build where applicable.
Tests use mocked provider responses; no invoice or real payment is created.
