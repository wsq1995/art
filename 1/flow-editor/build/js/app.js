"use strict";
var activitiModeler = angular.module("activitiModeler", ["ngCookies", "ngResource", "ngSanitize", "ngRoute", "ngDragDrop", "mgcrea.ngStrap", "ngGrid", "ngAnimate", "pascalprecht.translate", "duScroll", "base", "baseDirective", "nodeDefModel"]),
    activitiModule = activitiModeler;
activitiModeler.config(["$selectProvider", "$translateProvider", "$httpProvider", function (e, t, n) {
    angular.extend(e.defaults, {caretHtml: '&nbsp;<i class="icon icon-caret-down"></i>'}), t.useStaticFilesLoader({
        prefix: "./editor-app/i18n/",
        suffix: ".json"
    }), t.preferredLanguage("zh-CN"), t.useCookieStorage(), n.defaults.withCredentials = !0
}]).run(["$rootScope", "$timeout", "$modal", "$translate", "$location", "$window", "$http", "$q", function (v, s, e, t, n, l, a, i) {
    v.config = ACTIVITI.CONFIG, v.editorInitialized = !1, v.editorFactory = i.defer(), v.forceSelectionRefresh = !1, v.ignoreChanges = !1, v.validationErrors = [], v.staticIncludeVersion = Date.now(),
        v.safeApply = function (e) {
            var t = this.$root.$$phase;
            "$apply" == t || "$digest" == t ? e && "function" == typeof e && e() : this.$apply(e)
        },
        v.$on("$includeContentLoaded", function (e) {
            if (!v.editorInitialized) {
                ORYX._loadPlugins();
                var t = EDITOR.UTIL.getParameterByName("modelId");
                o = t, r = KISBPM.URL.getModel(o), a({method: "GET", url: r}).success(function (e, t, n, i) {
                    v.editor = new ORYX.Editor(e), v.modelData = angular.fromJson(e), v.$broadcast("bpmDefSetting", v.modelData.bpmDefSetting), v.editorFactory.resolve()
                }).error(function (e, t, n, i) {
                    console.log("Error loading model with id " + o + " " + e)
                }), v.window = {};
                var n = function () {
                    v.window.width = l.innerWidth, v.window.height = l.innerHeight
                };
                angular.element(l).bind("resize", function () {
                    v.safeApply(n())
                }), v.$watch("window.forceRefresh", function (e) {
                    e && s(function () {
                        n(), v.window.forceRefresh = !1
                    })
                }), n(), jQuery(window).resize(function () {
                    var e = jQuery("#editor-header").offset(), t = jQuery("#propertySection").height() + 36,
                        n = jQuery("#canvasSection"), i = jQuery("#main-header");
                    if (null != e && null !== e && null != t && null != n && null !== i) {
                        if (v.editor) {
                            var o = v.editor.selection, r = v.editor._subSelection;
                            v.selectedElements = o, v.subSelectionElements = r, o && 0 < o.length && (v.selectedElementBeforeScrolling = o[0], v.editor.setSelection([]), v.editor.setSelection(v.selectedElements, v.subSelectionElements), v.selectedElements = void 0, v.subSelectionElements = void 0)
                        }
                        var s = jQuery(window).height() - e.top - i.height() - 21;
                        n.height(s - t), jQuery("#paletteSection").height(s);
                        var l = null;
                        n && n[0].children[1] && (l = n[0].children[1]);
                        var a = n.position().top, c = n.position().left, u = n[0].clientHeight, d = n[0].clientWidth,
                            p = 0,
                            h = 0;
                        l && (h = l.clientWidth || l.parentNode.clientWidth), h < n[0].clientWidth && (c -= (p = h - n[0].clientWidth) / 2, d += p);
                        var f = jQuery("#canvas-grow-N");
                        f.css("top", a + 20 + "px"), f.css("left", c - 10 + (d - 17) / 2 + "px");
                        var y = jQuery("#canvas-grow-S");
                        y.css("top", a + u - 20 - 8 + "px"), y.css("left", c - 10 + (d - 17) / 2 + "px");
                        var E = jQuery("#canvas-grow-E");
                        E.css("top", a - 10 + (u - 17) / 2 + "px"), E.css("left", c + d - 20 - 8 + "px");
                        var g = jQuery("#canvas-grow-W");
                        g.css("top", a - 10 + (u - 17) / 2 + "px"), g.css("left", c + 20 + "px"), (f = jQuery("#canvas-shrink-N")).css("top", a + 20 + "px"), f.css("left", c + 10 + (d - 17) / 2 + "px"), (y = jQuery("#canvas-shrink-S")).css("top", a + u - 20 - 8 + "px"), y.css("left", c + 10 + (d - 17) / 2 + "px"), (E = jQuery("#canvas-shrink-E")).css("top", a + 10 + (u - 17) / 2 + "px"), E.css("left", c + d - 20 - 8 + "px"), (g = jQuery("#canvas-shrink-W")).css("top", a + 10 + (u - 17) / 2 + "px"), g.css("left", c + 20 + "px")
                    }
                }), jQuery(window).trigger("resize"), jQuery.fn.scrollStopped = function (t) {
                    jQuery(this).scroll(function () {
                        var e = jQuery(this);
                        e.data("scrollTimeout") && clearTimeout(e.data("scrollTimeout")), e.data("scrollTimeout", setTimeout(t, 50, this))
                    })
                }, (i = jQuery("#flowDesigner")).scroll(function () {
                    var e = v.editor.selection, t = v.editor._subSelection;
                    v.selectedElements = e, v.subSelectionElements = t, e && 0 < e.length && (v.selectedElementBeforeScrolling = e[0]), jQuery(".Oryx_button").each(function (e, t) {
                        v.orginalOryxButtonStyle = t.style.display, t.style.display = "none"
                    }), jQuery(".resizer_southeast").each(function (e, t) {
                        v.orginalResizerSEStyle = t.style.display, t.style.display = "none"
                    }), jQuery(".resizer_northwest").each(function (e, t) {
                        v.orginalResizerNWStyle = t.style.display, t.style.display = "none"
                    }), v.editor.handleEvents({type: ORYX.CONFIG.EVENT_CANVAS_SCROLL})
                }), i.scrollStopped(function () {
                    function n(e) {
                        0 < jQuery(e).position().top ? e.style.display = "block" : e.style.display = "none"
                    }

                    v.editor.setSelection([]), v.editor.setSelection(v.selectedElements, v.subSelectionElements), v.selectedElements = void 0, v.subSelectionElements = void 0, jQuery(".Oryx_button").each(function (e, t) {
                        n(t)
                    }), jQuery(".resizer_southeast").each(function (e, t) {
                        n(t)
                    }), jQuery(".resizer_northwest").each(function (e, t) {
                        n(t)
                    })
                }), v.editorInitialized = !0
            }
            var i, o, r
        }), v.editorFactory.promise.then(function () {
        KISBPM.eventBus.editor = v.editor, [{
            oryxType: ORYX.CONFIG.EVENT_SELECTION_CHANGED,
            kisBpmType: KISBPM.eventBus.EVENT_TYPE_SELECTION_CHANGE
        }, {
            oryxType: ORYX.CONFIG.EVENT_DBLCLICK,
            kisBpmType: KISBPM.eventBus.EVENT_TYPE_DOUBLE_CLICK
        }, {
            oryxType: ORYX.CONFIG.EVENT_MOUSEOUT,
            kisBpmType: KISBPM.eventBus.EVENT_TYPE_MOUSE_OUT
        }, {
            oryxType: ORYX.CONFIG.EVENT_MOUSEOVER,
            kisBpmType: KISBPM.eventBus.EVENT_TYPE_MOUSE_OVER
        }].forEach(function (t) {
            v.editor.registerOnEvent(t.oryxType, function (e) {
                KISBPM.eventBus.dispatch(t.kisBpmType, e)
            })
        }), v.editor.registerOnEvent(ORYX.CONFIG.EVENT_SHAPEREMOVED, function (e) {
            var t = document.getElementById(e.shape.resourceId + "-validate-button");
            t && (t.style.display = "none")
        }), KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_EDITOR_READY, {type: KISBPM.eventBus.EVENT_TYPE_EDITOR_READY})
    }), v.alerts = {queue: []}, v.showAlert = function (e) {
        0 < e.queue.length ? (e.current = e.queue.shift(), e.timeout = s(function () {
            0 == e.queue.length ? (e.current = void 0, e.timeout = void 0) : v.showAlert(e)
        }, "error" == e.current.type ? 5e3 : 1e3)) : v.alerts.current = void 0
    }, v.addAlert = function (e, t) {
        var n = {message: e, type: t};
        v.alerts.timeout ? v.alerts.queue.push(n) : (v.alerts.queue.push(n), v.showAlert(v.alerts))
    }, v.dismissAlert = function () {
        v.alerts.timeout ? (s.cancel(v.alerts.timeout), v.alerts.timeout = void 0, v.showAlert(v.alerts)) : v.alerts.current = void 0
    }, v.addAlertPromise = function (e, t) {
        e && e.then(function (e) {
            v.addAlert(e, t)
        })
    }
}]).filter("dateformat", function () {
    return function (e, t) {
        return e ? t ? moment(e).format(t) : moment(e).calendar() : ""
    }
}), String.prototype.startWith = function (e, t) {
    if (null == e || "" == e || 0 == this.length || e.length > this.length) return !1;
    var n = this.substr(0, e.length);
    return null == t || t ? n == e : n.toLowerCase() == e.toLowerCase()
};