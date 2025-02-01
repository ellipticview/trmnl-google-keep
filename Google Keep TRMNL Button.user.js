// ==UserScript==
// @name         Google Keep TRMNL Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a custom button to Google Keep edit modal
// @author       Your Name
// @match        https://keep.google.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the custom button
    function createCustomButton() {
        const button = document.createElement('div');
        button.role = 'button';
        button.className = 'Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe custom-trmnl-button';
        button.tabIndex = '0';
        button.style.userSelect = 'none';
        button.style.display = 'inline-flex';
        button.style.marginRight = '8px';
        button.style.position = 'absolute';
        button.style.right = '32px';
        button.setAttribute('data-tooltip-text', 'Display on TRMNL');
        button.setAttribute('aria-label', 'Display on TRMNL');

        // Add the icon
        const icon = document.createElement('img');
        icon.src = 'https://usetrmnl.com/images/favicons/favicon-32x32.png';
        icon.style.width = '20px';
        icon.style.height = '20px';
        icon.style.margin = '6px';
        button.appendChild(icon);

        // Add click event listener
        button.addEventListener('click', function() {
            console.log('Custom button clicked!');
            // Add your custom action here
        });

        return button;
    }

    // Function to insert the button
    function insertButton() {
        const modal = document.querySelector('.VIpgJd-TUo6Hb');
        if (modal) {
            // The class name of the Pin button in the top-right corner can vary, but it always starts with the same string.
            // SO we match on the beginning of the class string
            const pinButton = modal.querySelector('div[class^="Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe"]');
            if (pinButton && !modal.querySelector('.custom-trmnl-button')) {
                // Find the parent container that holds the buttons
                const buttonContainer = pinButton.parentElement;

                if (buttonContainer) {
                    buttonContainer.style.position = 'relative';
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
                const modal = document.querySelector('.VIpgJd-TUo6Hb');
                if (modal) {
                    insertButton();
                }
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
