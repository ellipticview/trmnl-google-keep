// ==UserScript==
// @name         Google Keep TRMNL Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a custom button to Google Keep edit modal
// @author       Your Name
// @match        https://keep.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      usetrmnl.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";
  const WEBHOOK_URL =
    "https://usetrmnl.com/api/custom_plugins/5d3e5a26-a32b-40dc-9c58-9a95fef90df7";
  const MODAL_SELECTOR = ".VIpgJd-TUo6Hb";

  // Function to highlight the selected modal window. Helpful during debugging.
  function highlightModal(modal) {
    const originalTransition = modal.style.transition;
    modal.style.transition = "box-shadow 0.3s ease";
    modal.style.boxShadow = "0 0 10px 4px rgba(255, 0, 0, 0.8)";

    setTimeout(() => {
      modal.style.boxShadow = "";
      modal.style.transition = originalTransition;
    }, 600);
  }

  // Function to get list items from the DOM
  function getListItems() {
    const modal = document.querySelector(MODAL_SELECTOR);
    if (!modal) {
      console.log("Modal window NOT found");
      return [];
    } else {
      highlightModal(modal);
      console.log("Modal window found");
    }

    // Find all list item text elements within the modal
    const items = Array.from(
      modal.querySelectorAll(".MPu53c .IZ65Hb-vIzZGf-L9AdLc-haAclf p"),
    )
      .map((item) => item.textContent.trim()) // Extract and trim text content
      .filter((itemText) => itemText); // Remove empty items

    // Log the extracted items to console
    console.log("Extracted todo items:", items);

    return items;
  }

  // Function to send data to webhook
  function sendToWebhook(items) {
    // console.log(items);

    // The list can have the value "List item" (usually at the start of the list, but also in the middle)
    // Remove all occurrences of "List item" from the array
    items = items.filter((item) => item !== "List item");
    // console.log(items);

    const firstFiveItems = items.slice(0, 5);
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
        // Check if the response status is 429 (Too Many Requests)
        if (response.status === 429) {
          console.log("Received 429 response: Too Many Requests");
          alert("Error from TRML: Too Many Requests. Please try again later.");
        }
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
    const modal = document.querySelector(MODAL_SELECTOR);
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
        const modal = document.querySelector(MODAL_SELECTOR);
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
