/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */
/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
const EleResize = {
  _handleResize(e) {
    const ele = e.target || e.srcElement;
    const trigger = ele.__resizeTrigger__;
    if (trigger) {
      const handlers = trigger.__z_resizeListeners;
      if (handlers) {
        const size = handlers.length;
        for (let i = 0; i < size; i++) {
          const h = handlers[i];
          const handler = h.handler;
          const context = h.context;
          handler.apply(context, [e]);
        }
      }
    }
  },
  _removeHandler(ele, handler, context) {
    const handlers = ele.__z_resizeListeners;
    if (handlers) {
      const size = handlers.length;
      for (let i = 0; i < size; i++) {
        const h = handlers[i];
        if (h.handler === handler && h.context === context) {
          handlers.splice(i, 1);
          return;
        }
      }
    }
  },
  _createResizeTrigger(ele) {
    const obj = document.createElement('object');
    obj.setAttribute('style',
      'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;');
    obj.onload = EleResize._handleObjectLoad;
    obj.type = 'text/html';
    ele.appendChild(obj);
    obj.data = 'about:blank';
    return obj;
  },
  _handleObjectLoad() {
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', EleResize._handleResize);
  },
};
if (document.attachEvent) { // ie9-10
  EleResize.on = function (ele, handler, context) {
    let handlers = ele.__z_resizeListeners;
    if (!handlers) {
      handlers = [];
      ele.__z_resizeListeners = handlers;
      ele.__resizeTrigger__ = ele;
      ele.attachEvent('onresize', EleResize._handleResize);
    }
    handlers.push({
      handler,
      context,
    });
  };
  EleResize.off = function (ele, handler, context) {
    const handlers = ele.__z_resizeListeners;
    if (handlers) {
      EleResize._removeHandler(ele, handler, context);
      if (handlers.length === 0) {
        ele.detachEvent('onresize', EleResize._handleResize);
        delete ele.__z_resizeListeners;
      }
    }
  };
} else {
  EleResize.on = function (ele, handler, context) {
    let handlers = ele.__z_resizeListeners;
    if (!handlers) {
      handlers = [];
      ele.__z_resizeListeners = handlers;

      if (getComputedStyle(ele, null).position === 'static') {
        ele.style.position = 'relative';
      }
      const obj = EleResize._createResizeTrigger(ele);
      ele.__resizeTrigger__ = obj;
      obj.__resizeElement__ = ele;
    }
    handlers.push({
      handler,
      context,
    });
  };
  EleResize.off = function (ele, handler, context) {
    const handlers = ele.__z_resizeListeners;
    if (handlers) {
      EleResize._removeHandler(ele, handler, context);
      if (handlers.length === 0) {
        const trigger = ele.__resizeTrigger__;
        if (trigger) {
          trigger.contentDocument.defaultView.removeEventListener('resize', EleResize._handleResize);
          ele.removeChild(trigger);
          delete ele.__resizeTrigger__;
        }
        delete ele.__z_resizeListeners;
      }
    }
  };
}

export default EleResize;
