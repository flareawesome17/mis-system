// public/serviceWorker.js

// Ensure you have registered the service worker in your index.js or App.js

// Add event listener for push notifications
self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'icon.png' // Path to an icon image
    });
});
