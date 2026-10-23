import { HelpTopic } from "@/types/settings";

export const HELP_TOPICS: HelpTopic[] = [
  // ─── 1. Getting Started ─────────────────────────────────────────────────────
  {
    id: "getting-started-account",
    category: "getting-started",
    categoryLabel: "Getting Started",
    title: "How to Create an Account & Sign In",
    summary:
      "Learn how to sign in via phone OTP, email/password, or browse as a guest with instant session activation.",
    steps: [
      "Tap the Profile icon in the top header or bottom navigation bar.",
      "Select 'Sign In to Existing Account' or 'Create New Account'.",
      "Enter your mobile number to receive a 6-digit one-time password (OTP), or use your registered email address.",
      "Once verified, your SmartClub Gold/Silver tier and saved order history will automatically hydrate.",
      "You can also continue as a Guest Shopper to scan and browse without creating an account immediately.",
    ],
    tips: [
      "Guest sessions can be converted into registered accounts at checkout to earn SmartClub reward points.",
    ],
    actionLink: {
      label: "Go to Sign In",
      href: "/login",
    },
    tags: ["Account", "Login", "Register", "OTP", "Guest"],
  },
  {
    id: "getting-started-finding-products",
    category: "getting-started",
    categoryLabel: "Getting Started",
    title: "Finding Products in the Supermarket",
    summary:
      "Search our inventory in real time by name, category, brand, or shelf location using the search bar or AI Assistant.",
    steps: [
      "Use the search bar on the Home screen to type any product name, brand, or dietary tag.",
      "Filter by category chips like 'Dairy & Eggs', 'Fruits & Vegetables', or 'Bakery'.",
      "Check the live in-stock badge to ensure the item is available on the current store's shelves.",
      "Alternatively, tap the 'Assistant' tab to describe what you need in plain English (e.g., 'Find snacks under ₹200').",
    ],
    tips: [
      "Select your local store branch from the header to see accurate local shelf prices.",
    ],
    actionLink: {
      label: "Explore Products",
      href: "/explore",
    },
    tags: ["Search", "Catalogue", "Filter", "Categories", "Assistant"],
  },
  {
    id: "getting-started-scanning-barcode",
    category: "getting-started",
    categoryLabel: "Getting Started",
    title: "How to Scan a Product Barcode or QR Code",
    summary:
      "Use your smartphone camera or manual barcode entry to instantly add products to your smart cart.",
    steps: [
      "Tap the prominent 'Scan' button in the center of the bottom navigation bar.",
      "Allow camera permissions when prompted by your browser.",
      "Hold your camera steady over the EAN-13 barcode or QR code on the product packaging.",
      "The scanner will beep and highlight the detected product with live pricing and nutrition info.",
      "Tap 'Add to Cart' to place the item into your active shopping session.",
      "If camera lighting is poor, tap 'Enter Barcode Manually' to type the 13-digit code directly.",
    ],
    tips: [
      "Ensure barcode is smooth and flat for fastest camera recognition.",
    ],
    actionLink: {
      label: "Open Barcode Scanner",
      href: "/scan",
    },
    tags: ["Scanner", "Barcode", "Camera", "QR", "Add Product"],
  },

  // ─── 2. Smart Cart ──────────────────────────────────────────────────────────
  {
    id: "smart-cart-managing-items",
    category: "smart-cart",
    categoryLabel: "Smart Cart & Billing",
    title: "Adding, Modifying Quantities & Removing Products",
    summary:
      "Understand how live billing calculates discounts, taxes, and net totals as you shop in the aisles.",
    steps: [
      "Tap the 'Cart' tab in the navigation bar to view your live itemized basket.",
      "Use the '+' and '-' buttons beside any item to adjust quantities instantly.",
      "Swipe or tap the trash icon to remove an unwanted item from your basket.",
      "An 'Undo' banner will briefly appear if you accidentally delete an item.",
      "The bill summary displays MRP Gross, Total Savings, 5% Tax Inclusive Amount, and Net Payable in Indian Rupees (₹).",
    ],
    tips: [
      "Your cart stays saved in your browser if you switch tabs or take a phone call.",
    ],
    actionLink: {
      label: "View Cart",
      href: "/cart",
    },
    tags: ["Cart", "Billing", "Quantities", "Undo", "Discounts"],
  },
  {
    id: "smart-cart-resolving-discrepancies",
    category: "smart-cart",
    categoryLabel: "Smart Cart & Billing",
    title: "Resolving Weight Mismatches & Verification Discrepancies",
    summary:
      "How SmartCart compares camera items with physical cart scale sensors, and how to resolve mismatch alerts.",
    steps: [
      "SmartCart carts feature a physical bottom scale sensor that measures expected item weights against your digital list.",
      "If an un-scanned item is placed into the cart, or a scanned item was not physically added, a 'Weight Discrepancy Alert' appears.",
      "Open '/cart/verification' to view the itemized scale comparison and discrepancy delta.",
      "Remove the un-scanned product or tap 'Scan Missing Item' to resolve the warning.",
      "If the packaging weight differs from factory specs, tap 'Request Staff Assistance' to alert a floor attendant.",
    ],
    tips: [
      "Cart verification must be green before you can proceed to self-checkout.",
    ],
    actionLink: {
      label: "Cart Verification",
      href: "/cart/verification",
    },
    tags: ["Verification", "Weight", "Scale", "Mismatch", "Security", "Staff"],
  },

  // ─── 3. Payments and Orders ─────────────────────────────────────────────────
  {
    id: "payments-methods-flow",
    category: "payments-orders",
    categoryLabel: "Payments & Orders",
    title: "Completing Self-Checkout & Supported Payment Methods",
    summary:
      "Review accepted payment modes including UPI apps, Credit/Debit cards, SmartClub Wallet, and Demo NetBanking.",
    steps: [
      "From your verified cart, tap 'Proceed to Self-Checkout'.",
      "Select your preferred payment method: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, or NetBanking.",
      "Verify the final payable amount, item count, and GST tax invoice preview.",
      "Tap 'Pay Securely' to initiate payment processing.",
      "Once payment status confirms 'Success', your digital order and exit pass are immediately generated.",
    ],
    tips: [
      "In Demo Mode, transactions are simulated safely without deducting real bank funds.",
    ],
    actionLink: {
      label: "Go to Checkout",
      href: "/checkout",
    },
    tags: ["Payment", "Checkout", "UPI", "Cards", "Invoice", "GST"],
  },
  {
    id: "payments-viewing-receipts",
    category: "payments-orders",
    categoryLabel: "Payments & Orders",
    title: "Accessing Digital Tax Receipts & Purchase History",
    summary:
      "Every completed transaction generates a legally compliant GST digital receipt accessible at any time.",
    steps: [
      "Navigate to 'Orders' from your profile or the top header.",
      "Tap any previous order to view its itemized digital receipt.",
      "The digital receipt includes Store GSTIN, date, transaction ID, line item discounts, and tax breakup.",
      "You can print the receipt, copy order details, or download a structured archive.",
    ],
    tips: [
      "Receipts never expire and remain accessible in your customer history.",
    ],
    actionLink: {
      label: "View Order History",
      href: "/orders",
    },
    tags: ["Receipts", "Tax Invoice", "GST", "Orders", "History"],
  },

  // ─── 4. Exit Validation ─────────────────────────────────────────────────────
  {
    id: "exit-qr-validation",
    category: "exit-validation",
    categoryLabel: "Exit Validation",
    title: "Displaying Your Exit QR Pass at the Turnstile",
    summary:
      "How to scan your digital exit pass at the store's exit barrier gates to complete your visit.",
    steps: [
      "After completing payment, tap 'View Exit QR Pass' or access it from your receipt.",
      "The Exit Pass displays a high-contrast dynamic QR code with a 4-character human-readable exit code.",
      "Hold your phone screen under the optical exit scanner at the store turnstile.",
      "The scanner verifies your payment status, cart tag, and cryptographic security token.",
      "The green turnstile gate will open automatically for exit.",
    ],
    tips: [
      "Exit passes remain valid for 30 minutes following payment confirmation.",
    ],
    actionLink: {
      label: "Exit Turnstile Scanner",
      href: "/exit-scanner",
    },
    tags: ["Exit Pass", "QR Code", "Turnstile", "Gate", "Security"],
  },
  {
    id: "exit-pass-expired-help",
    category: "exit-validation",
    categoryLabel: "Exit Validation",
    title: "What to Do If Your Exit Pass Is Expired or Invalid",
    summary:
      "Guidance for situations where you lingered in the store or the scanner rejects an exit code.",
    steps: [
      "Exit credentials have a 30-minute validity window for store security.",
      "If expired, tap 'Refresh Pass' on the exit screen to re-validate with the store server.",
      "If the gate scanner displays an error, show your receipt and exit code to the exit gate attendant.",
      "Staff can verify your 4-character code on their handheld terminal and release the barrier.",
    ],
    tips: [
      "Staff attendants can verify your order by searching your order ID (e.g., SC-DEMO-9041).",
    ],
    actionLink: {
      label: "Store Support",
      href: "/support",
    },
    tags: ["Expired", "Invalid", "Turnstile", "Staff", "Security"],
  },

  // ─── 5. Account and Notifications ───────────────────────────────────────────
  {
    id: "account-managing-notifications",
    category: "account-notifications",
    categoryLabel: "Account & Notifications",
    title: "Customizing Push Notifications & Shopping Alerts",
    summary:
      "Configure which alerts you receive across order status, cart verification, discounts, and quiet hours.",
    steps: [
      "Tap the Bell icon in the top header or visit '/notifications'.",
      "Tap 'Settings' to open Notification Preferences.",
      "Toggle specific categories: Shopping Reminders, Order Updates, Verification Alerts, or Promotions.",
      "Enable 'Do Not Disturb' to silence notifications during scheduled quiet hours.",
      "All preferences are saved automatically.",
    ],
    tips: [
      "Critical security and exit validation notices will always be delivered.",
    ],
    actionLink: {
      label: "Notification Settings",
      href: "/settings/notifications",
    },
    tags: ["Notifications", "Alerts", "Preferences", "Quiet Hours"],
  },
  {
    id: "account-privacy-data",
    category: "account-notifications",
    categoryLabel: "Account & Notifications",
    title: "Managing Privacy, Personalization & Data Export",
    summary:
      "Control whether AI recommendations use your purchase history, and download a copy of your account data.",
    steps: [
      "Go to '/settings' and locate the 'Privacy and Personalization' section.",
      "Toggle 'Personalized AI Recommendations' to enable or disable tailored suggestions.",
      "Tap 'Export Account Data' to download an authoritative JSON archive of your profile, orders, and preferences.",
      "To delete your account, follow the step-by-step confirmation in the Danger Zone.",
    ],
    tips: [
      "Exporting account data does not expose any passwords or payment card details.",
    ],
    actionLink: {
      label: "Settings",
      href: "/settings",
    },
    tags: ["Privacy", "Export", "Personalization", "Security", "GDPR"],
  },
];
