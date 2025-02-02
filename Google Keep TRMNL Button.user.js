// ==UserScript==
// @name         Google Keep TRMNL Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a custom button to Google Keep edit modal
// @author       Your Name
// @match        https://keep.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      usetrmnl.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";
  const WEBHOOK_URL = "https://usetrmnl.com/api/custom_plugins/...";

  // Function to get list items from the DOM
  function getListItems() {
    const modal = document.querySelector(".VIpgJd-TUo6Hb");
    if (!modal) return [];

    // Find all list items that have content
    const items = Array.from(
      modal.querySelectorAll(
        ".CmABtb-YPqjbf-sM5MNb .IZ65Hb-YPqjbf.CmABtb-YPqjbf",
      ),
    )
      .filter((item) => item.textContent.trim()) // Remove empty items
      .map((item) => item.textContent.trim());

    return items;
  }

  // Function to send data to webhook
  function sendToWebhook(items) {
    // The first item in the list is "List item" so we start at array index 1
    const firstFiveItems = items.slice(1, 6);
    const data = {
      merge_variables: {
        items: firstFiveItems,
      },
    };

    GM_xmlhttpRequest({
      method: "POST",
      url: WEBHOOK_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      onload: function (response) {
        console.log("Webhook response:", response);
      },
      onerror: function (error) {
        console.error("Webhook error:", error);
      },
    });
  }

  // Function to create the custom button
  function createCustomButton() {
    const button = document.createElement("div");
    button.role = "button";
    button.className =
      "Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe custom-trmnl-button";
    button.tabIndex = "0";
    button.style.userSelect = "none";
    button.style.display = "inline-flex";
    button.style.marginRight = "8px";
    button.style.position = "absolute";
    button.style.right = "32px";
    button.setAttribute("data-tooltip-text", "Display on TRMNL");
    button.setAttribute("aria-label", "Display on TRMNL");

    // Add the icon
    const icon = document.createElement("img");
    icon.src = "https://usetrmnl.com/images/favicons/favicon-32x32.png";
    icon.style.margin = "6px";
    button.appendChild(icon);

    // Add click event listener
    button.addEventListener("click", function () {
      const items = getListItems();
      sendToWebhook(items);
    });

    return button;
  }

  // Function to insert the button
  function insertButton() {
    const modal = document.querySelector(".VIpgJd-TUo6Hb");
    if (modal) {
      const pinButton = modal.querySelector(
        'div[class^="Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe"]',
      );
      if (pinButton && !modal.querySelector(".custom-trmnl-button")) {
        const buttonContainer = pinButton.parentElement;
        if (buttonContainer) {
          buttonContainer.style.position = "relative";
          const customButton = createCustomButton();
          buttonContainer.appendChild(customButton);
        }
      }
    }
  }

  // Create and insert the button when a note is opened
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const modal = document.querySelector(".VIpgJd-TUo6Hb");
        if (modal) {
          insertButton();
        }
      }
    });
  });

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
