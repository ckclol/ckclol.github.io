!function() {
    "use strict";
    /**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
    function t(e, i) {
        var o;
        if (i = i || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = i.touchBoundary || 10,
        this.layer = e,
        this.tapDelay = i.tapDelay || 200,
        this.tapTimeout = i.tapTimeout || 700,
        !t.notNeeded(e)) {
            for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = this, c = 0, s = r.length; c < s; c++)
                a[r[c]] = l(a[r[c]], a);
            n && (e.addEventListener("mouseover", this.onMouse, !0),
            e.addEventListener("mousedown", this.onMouse, !0),
            e.addEventListener("mouseup", this.onMouse, !0)),
            e.addEventListener("click", this.onClick, !0),
            e.addEventListener("touchstart", this.onTouchStart, !1),
            e.addEventListener("touchmove", this.onTouchMove, !1),
            e.addEventListener("touchend", this.onTouchEnd, !1),
            e.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, i) {
                var o = Node.prototype.removeEventListener;
                "click" === t ? o.call(e, t, n.hijacked || n, i) : o.call(e, t, n, i)
            }
            ,
            e.addEventListener = function(t, n, i) {
                var o = Node.prototype.addEventListener;
                "click" === t ? o.call(e, t, n.hijacked || (n.hijacked = function(t) {
                    t.propagationStopped || n(t)
                }
                ), i) : o.call(e, t, n, i)
            }
            ),
            "function" == typeof e.onclick && (o = e.onclick,
            e.addEventListener("click", function(t) {
                o(t)
            }, !1),
            e.onclick = null)
        }
        function l(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0
      , n = navigator.userAgent.indexOf("Android") > 0 && !e
      , i = /iP(ad|hone|od)/.test(navigator.userAgent) && !e
      , o = i && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , r = i && /OS [6-7]_\d/.test(navigator.userAgent)
      , a = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (t.disabled)
                return !0;
            break;
        case "input":
            if (i && "file" === t.type || t.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }
    ,
    t.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !n;
        case "input":
            switch (t.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !t.disabled && !t.readOnly;
        default:
            return /\bneedsfocus\b/.test(t.className)
        }
    }
    ,
    t.prototype.sendClick = function(t, e) {
        var n, i;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(),
        i = e.changedTouches[0],
        (n = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null),
        n.forwardedTouchEvent = !0,
        t.dispatchEvent(n)
    }
    ,
    t.prototype.determineEventType = function(t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    t.prototype.focus = function(t) {
        var e;
        i && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length,
        t.setSelectionRange(e, e)) : t.focus()
    }
    ,
    t.prototype.updateScrollParent = function(t) {
        var e, n;
        if (!(e = t.fastClickScrollParent) || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n,
                    t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }
    ,
    t.prototype.getTargetElementFromEventTarget = function(t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }
    ,
    t.prototype.onTouchStart = function(t) {
        var e, n, r;
        if (t.targetTouches.length > 1)
            return !0;
        if (e = this.getTargetElementFromEventTarget(t.target),
        n = t.targetTouches[0],
        i) {
            if ((r = window.getSelection()).rangeCount && !r.isCollapsed)
                return !0;
            if (!o) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier)
                    return t.preventDefault(),
                    !1;
                this.lastTouchIdentifier = n.identifier,
                this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = t.timeStamp,
        this.targetElement = e,
        this.touchStartX = n.pageX,
        this.touchStartY = n.pageY,
        t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(),
        !0
    }
    ,
    t.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0]
          , n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n
    }
    ,
    t.prototype.onTouchMove = function(t) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1,
        this.targetElement = null),
        !0)
    }
    ,
    t.prototype.findControl = function(t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    t.prototype.onTouchEnd = function(t) {
        var e, a, c, s, l, u = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0,
            !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = t.timeStamp,
        a = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        r && (l = t.changedTouches[0],
        (u = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || u).fastClickScrollParent = this.targetElement.fastClickScrollParent),
        "label" === (c = u.tagName.toLowerCase())) {
            if (e = this.findControl(u)) {
                if (this.focus(u),
                n)
                    return !1;
                u = e
            }
        } else if (this.needsFocus(u))
            return t.timeStamp - a > 100 || i && window.top !== window && "input" === c ? (this.targetElement = null,
            !1) : (this.focus(u),
            this.sendClick(u, t),
            i && "select" === c || (this.targetElement = null,
            t.preventDefault()),
            !1);
        return !(!i || o || !(s = u.fastClickScrollParent) || s.fastClickLastScrollTop === s.scrollTop) || (this.needsClick(u) || (t.preventDefault(),
        this.sendClick(u, t)),
        !1)
    }
    ,
    t.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null
    }
    ,
    t.prototype.onMouse = function(t) {
        return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0,
        t.stopPropagation(),
        t.preventDefault(),
        !1))))
    }
    ,
    t.prototype.onClick = function(t) {
        var e;
        return this.trackingClick ? (this.targetElement = null,
        this.trackingClick = !1,
        !0) : "submit" === t.target.type && 0 === t.detail || ((e = this.onMouse(t)) || (this.targetElement = null),
        e)
    }
    ,
    t.prototype.destroy = function() {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0),
        t.removeEventListener("mousedown", this.onMouse, !0),
        t.removeEventListener("mouseup", this.onMouse, !0)),
        t.removeEventListener("click", this.onClick, !0),
        t.removeEventListener("touchstart", this.onTouchStart, !1),
        t.removeEventListener("touchmove", this.onTouchMove, !1),
        t.removeEventListener("touchend", this.onTouchEnd, !1),
        t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    t.notNeeded = function(t) {
        var e, i, o;
        if (void 0 === window.ontouchstart)
            return !0;
        if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n)
                return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no"))
                    return !0;
                if (i > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (a && (o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] >= 10 && o[2] >= 3 && (e = document.querySelector("meta[name=viewport]"))) {
            if (-1 !== e.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction))
    }
    ,
    t.attach = function(e, n) {
        return new t(e,n)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach,
    module.exports.FastClick = t) : window.FastClick = t
}(),
/*! Basic iOS 7 CSS // Apache License 2.0 // hbang.ws */
function(t) {
    "use strict";
    var e = t.documentElement
      , n = e.classList;
    if (-1 != navigator.userAgent.indexOf("Cydia") ? (-1 != t.title.indexOf(" ?? ") && (t.title = t.title.split(" ?? ")[0]),
    n.add("cydia")) : n.remove("cydia", "depiction"),
    "devicePixelRatio"in window && devicePixelRatio >= 2) {
        var i = t.createElement("div");
        i.style.border = ".5px solid transparent",
        e.appendChild(i),
        i.offsetHeight > 0 && n.add("has-subpixel"),
        devicePixelRatio >= 3 && n.add("has-subpixel-3x"),
        e.removeChild(i),
        "FastClick"in window && e.addEventListener("DOMContentLoaded", function() {
            FastClick.attach(e.body)
        })
    }
}(document);
//# sourceMappingURL=ios7.min.js.map
