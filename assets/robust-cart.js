"use strict";
var __awaiter = this && this.__awaiter || function(t, n, a, c) {
    return new (a = a || Promise)(function(i, e) {
        function r(t) {
            try {
                o(c.next(t))
            } catch (t) {
                e(t)
            }
        }
        function s(t) {
            try {
                o(c.throw(t))
            } catch (t) {
                e(t)
            }
        }
        function o(t) {
            var e;
            t.done ? i(t.value) : ((e = t.value)instanceof a ? e : new a(function(t) {
                t(e)
            }
            )).then(r, s)
        }
        o((c = c.apply(t, n || [])).next())
    }
    )
}
;
class RobustCart {
    constructor(t, e, i, r, s, o, rl, rp) {
        this.log = t=>{
            window.ROBUST_CART_DEV && console.log("%cRobust Cart: " + t, "background: #cd302b; color: #fff", this)
        }
        ,
        this.createAddToCartPromise = t=>{
            t = new FormData(t),
            t = Object.fromEntries(t.entries()),
            t = JSON.stringify(t);
            return fetch(this.cartAddUrl, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: t
            })
        }
        ,
        this.createFetchCartPromise = ()=>fetch("/?section_id=robust-cart"),
        this.createUpdateCartItemPromise = (t,e)=>{
            return fetch(this.cartChangeUrl, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: t,
                    quantity: e
                })
            })
        }
        ,
        this.openCart = ()=>{
            this.rootEl.classList.add("rc90--open"),
            this.scrollPosition = window.scrollY,
            this.lockScroll()
        }
        ,
        this.closeCart = ()=>{
            this.rootEl.classList.remove("rc90--open"),
            this.unlockScroll()
        }
        ,
        this.refreshCart = ()=>__awaiter(this, void 0, void 0, function*() {
            var t = yield(yield this.createFetchCartPromise()).text()
              , e = document.createElement("div")
              , t = (e.innerHTML = t,
            e.querySelector(".rc90-box"));
            this.rootEl.querySelector(".rc90-box").innerHTML = t.innerHTML,
            this.addInnerListeners()
        }),
        this.removeCartItem = t=>__awaiter(this, void 0, void 0, function*() {
            yield this.createUpdateCartItemPromise(t, 0),
            yield this.refreshCart()
        }),
        this.changeCartItemQuantity = (t,e)=>__awaiter(this, void 0, void 0, function*() {
            console.log("in here"),
            yield this.createUpdateCartItemPromise(t, e),
            yield this.refreshCart()
        }),
        this.getCartJson = ()=>{
            var t = this.rootEl.querySelector(".robust-cart-json");
            if (t) {
                t = t.getAttribute("data-cart-json");
                if (t)
                    return JSON.parse(t)
            }
        }
        ,
        this.addAllListeners = ()=>{
            this.addOpenCartListeners(),
            this.addCartBoxListener(),
            this.addInnerListeners()
        }
        ,
        this.addInnerListeners = ()=>{
            this.addCloseCartListeners(),
            this.addFormSubmissionListeners(),
            this.addItemRemoveListeners(),
            this.addItemQuantityListeners(),
            this.recommendedItemAddListener()
        }
        ,
        this.addCartBoxListener = ()=>{
            this.log("Adding cart box click listener");
            var t = this.rootEl.querySelector(".rc90-box");
            t && t.addEventListener("click", t=>{
                t.stopPropagation()
            }
            )
        }
        ,
        this.addOpenCartListeners = ()=>{
            this.log("Adding open click listeners"),
            document.querySelectorAll(`[href="${this.cartUrl}"], [href="/cart"]`).forEach(t=>{
                t.addEventListener("click", t=>{
                    t.preventDefault(),
                    this.openCart()
                }
                )
            }
            )
        }
        ,
        this.addCloseCartListeners = ()=>{
            this.log("Adding close click listeners"),
            this.rootEl.addEventListener("click", this.closeCart),
            this.rootEl.querySelectorAll(".rc90-header-close, .rc90-buttons-continue-shopping, .rc90-empty-inner-continue").forEach(t=>{
                t.addEventListener("click", this.closeCart)
            }
            )
        }
        ,
        this.addFormSubmissionListeners = ()=>{
            // this.log("Adding add form submission listeners"),
            document.addEventListener("click", e=>__awaiter(this, void 0, void 0, function*() {
              var t;
              e.target.matches(`form[action="${this.cartAddUrl}"] button[name="add"], form[action="${this.cartAddUrl}"] button[name="add"] *`) && (e.preventDefault(),
              t = e.target.closest(`form[action="${this.cartAddUrl}"]`),
              yield this.createAddToCartPromise(t),
              yield this.refreshCart(),
              this.openCart())
            }), !1)
        }
        ,
        this.addItemRemoveListeners = ()=>{
            this.log(this.rootEl),
            this.log("Adding remove item click listeners"),
            this.rootEl.querySelectorAll(".rc90-item-main-header-remove").forEach(e=>{
                e.addEventListener("click", ()=>{
                    var t = e.getAttribute("data-line-item-key");
                    t && this.removeCartItem(t)
                }
                )
            }
            )
        }
        ,
        this.addItemQuantityListeners = ()=>{
            this.rootEl.querySelectorAll(".rc90-item-main-footer-quantity-plus, .rc90-item-main-footer-quantity-minus").forEach(t=>{
                var e = t.classList.contains("rc90-item-main-footer-quantity-plus");
                const i = t.getAttribute("data-line-item-key");
                var r = Number(t.getAttribute("data-quantity"));
                if (i && r) {
                    const s = e ? r + 1 : r - 1;
                    t.addEventListener("click", ()=>__awaiter(this, void 0, void 0, function*() {
                        yield this.changeCartItemQuantity(i, s)
                    }))
                }
            }
            )
        },
        this.lockScroll = ()=>{
            var t = this.scrollPosition
              , e = document.body;
            e.style.position = "fixed",
            e.style.top = `-${t}px`
        }
        ,
        this.unlockScroll = ()=>{
            var t = document.body
              , e = t.style.top;
            t.style.position = "",
            t.style.top = "",
            window.scrollTo(0, -1 * parseInt(e || "0"))
        }
        ,
        this.log("Initializing"),
        this.cartUrl = r,
        this.cartAddUrl = s,
        this.cartChangeUrl = o,
        this.rootEl = t,
        this.country = e,
        this.currency = i,
        this.recommendedItemAddListener = rl,
        this.recommendedProducts = rp,
        this.scrollPosition = window.scrollY,
        this.addAllListeners(),
        this.log("Initialized")
    }
}
