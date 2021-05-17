// import Vue from 'vue';

// Osano cookie consent plugin
var initCookieConsent = () => {
  window.cookieconsent.initialise({
    type: 'opt-in',
    position: 'bottom',
    animateRevokable: false,

    // Revoke button
    revokeBtn: '<div class="cc-revoke px-20 {{classes}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120.23 122.88" class="pointer-events-none fill-current w-6"><path d="M98.18 0c3.3 0 5.98 2.68 5.98 5.98 0 3.3-2.68 5.98-5.98 5.98-3.3 0-5.98-2.68-5.98-5.98.01-3.3 2.68-5.98 5.98-5.98zm1.6 52.08c5.16 7.7 11.69 10.06 20.17 4.85.28 2.9.35 5.86.2 8.86-1.67 33.16-29.9 58.69-63.06 57.02C23.94 121.13-1.59 92.9.08 59.75 1.74 26.59 30.95.78 64.1 2.45c-2.94 9.2-.45 17.37 7.03 20.15-6.78 21.78 8.36 36.03 28.65 29.48zm-69.75-4.29c4.97 0 8.99 4.03 8.99 8.99s-4.03 8.99-8.99 8.99c-4.97 0-8.99-4.03-8.99-8.99s4.03-8.99 8.99-8.99zm28.32 11.46a5.181 5.181 0 010 10.36c-2.86 0-5.18-2.32-5.18-5.18-.01-2.86 2.31-5.18 5.18-5.18zM35.87 80.59a6.32 6.32 0 11-6.32 6.32c0-3.5 2.83-6.32 6.32-6.32zm13.62-48.36c2.74 0 4.95 2.22 4.95 4.95 0 2.74-2.22 4.95-4.95 4.95-2.74 0-4.95-2.22-4.95-4.95s2.22-4.95 4.95-4.95zm26.9 50.57c4.59 0 8.3 3.72 8.3 8.3 0 4.59-3.72 8.3-8.3 8.3-4.59 0-8.3-3.72-8.3-8.3s3.72-8.3 8.3-8.3zm17.48-59.7c3.08 0 5.58 2.5 5.58 5.58s-2.5 5.58-5.58 5.58-5.58-2.5-5.58-5.58 2.5-5.58 5.58-5.58z" fill-rule="evenodd" clip-rule="evenodd"/></svg></div>',

    // Popup container
    window: '<div role="dialog" aria-live="polite" aria-label="cookieconsent" aria-describedby="cookieconsent:desc" class="cc-window {{classes}}"><!--googleoff: all-->{{children}}<!--googleon: all--></div>',

    // Elements to include in the cookie popup
    elements: {
      header: '<h4 class="cc-header mb-20">Hi there, we use cookies!</h4>',
      messagelink: `<span id="cookieconsent:desc" class="cc-message">We use cookies to provide you with a better experience when browsing this site. <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="/privacy" target="_blank">Privacy Policy</a></span>`,
      allow: '<a href="#" aria-label="allow cookies" tabindex="0" class="cc-btn cc-allow button mr-8">Accept</a>',
      deny: '<a href="#" aria-label="deny cookies" tabindex="0" class="cc-btn cc-deny">Deny</a>',
      link: '<a href="#" aria-label="learn more about cookies" tabindex="0" class="cc-link outline-none" href="/privacy-policy/" target="_blank"></a>',
      close: '<span aria-label="dismiss cookie message" tabindex="0" class="cc-close m-0 outline-none"><svg height="24" width="24" class="pointer-events-none"><path d="M0 0h24v24H0z" fill="none"/><path class="color-grey-darkest pointer-none fill-current-color" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>',
    },

    // Defines the layout to be used - list elements from above as needed
    layouts: {
      'froyio': '{{messagelink}}{{compliance}}{{close}}',
    },
    layout: 'froyio',

    // On init
    onInitialise: function (status) {
      window.Vue.prototype.$cookieConsented = status;
      if (this.hasConsented()) {
        //console.log(status);
        enableGA();
      } else if (!this.hasConsented()) {
        //console.log(status);
        clearCookies();
      }
    },

    // Consent callback
    onStatusChange: function (status) {
      if (event.target.matches('.cc-close')) return false;
      window.Vue.prototype.$cookieConsented = status;
      if (this.hasConsented()) {
        //console.log(status);
      } else if (!this.hasConsented()) {
        //console.log(status);
      }
      window.location.reload(true);
    },

    // Cookie set based on consent to remember user choice
    cookie: {
      // This is the name of this cookie
      name: 'cookieconsent_status',
      // This is the url path that the cookie 'name' belongs to. The cookie can only be read at this location
      path: '/',
      // This is the domain that the cookie 'name' belongs to. The cookie can only be read on this domain.
      //  - Guide to cookie domains - https://www.mxsasha.eu/blog/2014/03/04/definitive-guide-to-cookie-domains/
      domain: (typeof window !== undefined) ? window.location.hostname : 'localhost',
      // The cookies expire date, specified in days (specify -1 for no expiry)
      expiryDays: 365,
      // If true the cookie will be created with the secure flag. Secure cookies will only be transmitted via HTTPS.
      secure: false
    },
    law: {
      regionalLaw: false,
    },
    location: false
  });
};

// Get osano cookiconsent cookie for checking status
function getCookieValue(name) {
  if (typeof document == 'undefined') return false;
  let value = '; ' + document.cookie;
  let parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// Clear cookies if cookie status is set to deny
function clearCookies() {
  if (typeof document == 'undefined') return false;
  let whitelist = ['cookieconsent_status'];
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].replace(/\s/g, '').split('=')[0];
    if (!whitelist.includes(cookie)) {
      document.cookie = cookie + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}

// Add any cookie dependent functions here
// Bootstrap GA once cookies are accepted
function enableGA() {
  // Add any code here thats dependeant upon cookie consent being accepted
}

// Export necessary functions
// export { initCookieConsent, getCookieValue };
