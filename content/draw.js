(async function visualBell() {
    function promiseHolder() {
        let h = (resolve, reject) => {
            h.resolve = (...rest) => {
                reset();
                resolve(...rest);
            };
            h.reject = (...rest) => {
                reset();
                reject(...rest);
            };
            h.fulfilled = false;
        };
        function reset() {
            h.resolve = null;
            h.reject = null;
            h.fulfilled = true;
        }
        reset();
        return h;
    }

    console.log("Loadding addon code");
    debugger;

    // Create an overlay to collect all pointer events.
    let overlay = document.createElement("div");
    overlay.setAttribute("id", "visualBell_overlay");
    let onpointerdown = promiseHolder();
    overlay.onpointerdown = event => {
        if (onpointerdown.fulfilled) {
            return;
        }
        onpointerdown.resolve({
            event: "down",
            target: event.target,
            clientX: event.clientX,
            clientY: event.clientY
        });
        event.preventDefault();
    };

    let onpointermove = promiseHolder();
    overlay.onpointermove = event => {
        if (onpointermove.fulfilled) {
            return;
        }
        onpointermove.resolve({
            event: "move",
            target: event.target,
            clientX: event.clientX,
            clientY: event.clientY
        });
        event.preventDefault();
    };

    // Create a selection area to display what should be monitored.
    let select = document.createElement("div");
    select.setAttribute("id", "visualBell_select");

    document.body.parentElement.appendChild(overlay);
    document.body.parentElement.appendChild(select);

    // Wait on the first click to start the selection area.
    let evStart = await new Promise(onpointerdown);
    let s = {y: evStart.clientY, x: evStart.clientX};

    // Wait on the second click to end the selectino area.
    var down = new Promise(onpointerdown);
    let ev = null, e = {y:0, x:0};
    while (!onpointerdown.fulfilled) {
        var move = new Promise(onpointermove);
        ev = await Promise.race([down, move]);
        e = {y: ev.clientY, x: ev.clientX};
        select.style.top = Math.min(s.y, e.y) + "px";
        select.style.left = Math.min(s.x, e.x) + "px";
        select.style.height = Math.abs(s.y - e.y) + "px";
        select.style.width = Math.abs(s.x - e.x) + "px";
    }

    let evEnd = ev;
    let t = 0;
    if (e.x < s.x) {
        t = e.x;
        e.x = s.x;
        s.x = t;
    }
    if (e.y < s.y) {
        t = e.y;
        e.y = s.y;
        s.y = t;
    }
    e.x -= s.x;
    e.y -= s.y;

    document.body.parentElement.removeChild(overlay);
    document.body.parentElement.removeChild(select);

    // Now we have a selection area. We sample a few random points in the
    // eselected area to find what points belongs to the outermost dom elements.
    let nbPoints = 500;
    function getRandomElements() {
        return document.elementsFromPoint(s.x + Math.floor(e.x * Math.random()),
                                          s.y + Math.floor(e.y * Math.random()));
    }
    let common = getRandomElements();
    for (let i = 0; i < nbPoints; i++) {
        let test = getRandomElements();
        while (test.length > common.length) test.shift();
        while (common.length > test.length) common.shift();
        while (common[0] !== test[0]) {
            test.shift();
            common.shift();
        }
    }

    // We found the DOM element which is encapsulating the selected area.
    let elem = common[0];
    let obs = new MutationObserver((mut, self) => {
        elem.classList.remove("visualBell_outline");
        void elem.offsetWidth;
        elem.classList.add("visualBell_outline");
    });
    obs.observe(elem, {
        childList: true,
        characterData: true,
        subtree: true
    });
})()
