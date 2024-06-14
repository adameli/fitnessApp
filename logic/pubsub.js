let listeners = {};

export const PubSub = {

    subscribe: function (data) {
        let event = data.event;
        let listener = data.listener;

        if (listeners[event] === undefined) {
            listeners[event] = [listener];
        } else {
            listeners[event].push(listener);
        }

    },

    publish: function (data) {
        let event = data.event;
        let detail = data.detail;

        if (event === undefined) { console.log("No event type, control your publish!"); }

        if (event) {
            console.log("Event Published: " + event, detail);
        }

        if (listeners[event] === undefined) {
            console.log(`Event ${event} has no listeners`);
            return;
        }

        listeners[event].forEach(listener => {

            //*if the listiner is a function we'll invoke it with detail
            if (typeof listener === 'function') {
                listener(detail)
            } else {
                listener.dispatchEvent(new CustomEvent(event, { detail }));
            }
        })
    },

    unsubscribe: function (data) {
        let event = data.event;
        let listener = data.listener
        // If no one is listening we'll do nothing
        if (listeners[event] === undefined) {
            return;
        }
        // Otherwise we'll filter out the listener from the array of listeners
        listeners[event] = listeners[event].filter((currentListener) => {
            // If they're unsubscribing a listener which is a function, we'll compare the function names
            if (typeof currentListener === 'function') {
                return currentListener.name !== listener.name;
            }
            // Components can be compared normally
            return currentListener !== listener;
        });
    }
}
