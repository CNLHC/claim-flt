declare global {
  interface Window {
    clarity: any;
  }
}

function clarity(...args: any) {
  if (typeof window == "undefined") {
    //ssr
    return;
  }
  var params = Array.prototype.slice.call(arguments);
  if (!window.clarity) {
    init(process.env.NEXT_PUBLIC_CLARITY_ID);
  }

  window.clarity.apply(undefined, params);
}

function init(id?: string) {
  if (typeof id != "string") {
    throw new Error("Clarity ID is not spectifed");
  }
  if (typeof window == "undefined") {
    return;
  }
  (function (c: any, l: any, a: any, r: any, i: any) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    let t: any = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    let y: any = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

function hasStarted() {
  return typeof window.clarity === "function";
}

function identify(userId: string, properties: unknown) {
  clarity("identify", userId, properties);
}

function consent() {
  clarity("consent");
}

function setTag(key: string, value: string) {
  clarity("set", key, value);
}

function upgrade(reason: any) {
  clarity("upgrade", reason);
}

const Clarity = {
  init,
  hasStarted,
  identify,
  consent,
  setTag,
  upgrade,
};
export default Clarity;
