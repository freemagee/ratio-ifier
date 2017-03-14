var model = {
    init: function() {
        this.ratioLocked = false;
        this.ratio = null;
    },
    calculateRatio: function(w, h) {
        var exportObj = {};
        var shape = null;

        if (w > h) {
            this.ratio = (w / h);
            shape = 'landscape';
        } else if (h > w) {
            this.ratio = (h / w);
            shape = 'portrait';
        } else {
            this.ratio = 1;
            shape = 'square';
        }

        model.setDimensions(w, h);
        exportObj = {ratio: this.ratio, shape: shape, w: w, h: h};

        controller.setRatio(exportObj);
    },
    getRatio: function() {
        return this.ratio;
    },
    setDimensions: function(w, h) {
        this.w = w;
        this.h = h;
    },
    recalculateDimensions: function(newW, newH) {
        var value = null;

        if (this.w !== this.h) {
            if (this.w > this.h) {
                if (this.w !== newW) {
                    newH = newW / this.ratio;
                } else if (this.h !== newH) {
                    newW = newH * this.ratio;
                }
            } else {
                if (this.h !== newH) {
                    newW = newH / this.ratio;
                } else if (this.w !== newW) {
                    newH = newW * this.ratio;
                }
            }
        } else {
            if (this.w !== newW) {
                newH = newW;
            } else {
                newW = newH;
            }
        }

        model.setDimensions(newW, newH);

        return {width: newW, height: newH};
    },
    lockRatio: function(b) {
        this.ratioLocked = b;
    },
    lockStatus: function() {
        return this.ratioLocked;
    }
};

var controller = {
    setRatio: function(obj) {
        view.renderRatio(obj);
    },
    calculateRatio: function(w, h) {
        if (this.isExpectedInput(w, h)) {
            w = parseFloat(w);
            h = parseFloat(h);

            return model.calculateRatio(w, h);
        } else {
            return false;
        }
    },
    lockTheRatio: function(b) {
        model.lockRatio(b);
    },
    getLockStatus: function() {
        return model.lockStatus();
    },
    recalculateDimensions: function(w, h) {
        if (this.isExpectedInput(w, h)) {
            var obj = {};

            w = parseFloat(w);
            h = parseFloat(h);
            obj = model.recalculateDimensions(w, h);

            view.renderRecalculatedRatio(obj);
        }
    },
    isExpectedInput: function(w, h) {
        // Because w & h are taken from input values, their type is string
        if (w === '' || h === '') {
            view.renderError('Please enter values into Width and Height');

            return false;
        } else {
            // It is also possible a user does not enter a number
            if (isNaN(w) || isNaN(h)) {
                view.renderError('Please enter numbers into Width and Height');

                return false;
            } else {
                return true;
            }
        }
    },
    init: function() {
        model.init();
        view.init();
    }
};

var view = {
    DOM: {},
    render: function() {
        var _this = view.DOM;

        this.DOM.calculateBtn.addEventListener('click', function(e) {
            controller.calculateRatio(_this.itemWidth.value, _this.itemHeight.value);
        });
        this.DOM.lockBtn.addEventListener('click', view.lockTheRatio);
        this.DOM.recalculateBtn.addEventListener('click', function(e) {
            controller.recalculateDimensions(_this.resultWidth.dataset.value, _this.resultHeight.dataset.value);
        });
        this.DOM.resultWidth.addEventListener('change', function(e) {
            this.dataset.value = this.value;
        });
        this.DOM.resultHeight.addEventListener('change', function(e) {
            this.dataset.value = this.value;
        });
    },
    renderRatio: function(obj) {
        this.DOM.resultWidth.dataset.value = obj.w;
        this.DOM.resultWidth.value = obj.w;
        this.DOM.resultHeight.dataset.value = obj.h;
        this.DOM.resultHeight.value = obj.h;
        this.DOM.lockBtn.disabled = false;

        view.renderResult(obj);
    },
    renderResult: function(obj) {
        this.DOM.result.children[0].dataset.ratio = obj.ratio;
        this.DOM.result.children[0].innerHTML = obj.ratio.toFixed(2);
        this.DOM.visual.className = '';

        if (obj.shape === 'landscape') {
            this.DOM.visual.classList.add('landscape');
        } else if (obj.shape === 'portrait') {
            this.DOM.visual.classList.add('portrait');
        } else {
            this.DOM.visual.classList.add('square');
        }
    },
    renderRecalculatedRatio: function(obj) {
        // Set new width
        this.DOM.resultWidth.dataset.value = obj.width;
        (obj.width % 1 !== 0) ? this.DOM.resultWidth.value = obj.width.toFixed(2) : this.DOM.resultWidth.value = obj.width;// If value is a whole number, don't force decimal
        // Set new height
        this.DOM.resultHeight.dataset.value = obj.height;
        (obj.height % 1 !== 0) ? this.DOM.resultHeight.value = obj.height.toFixed(2) : this.DOM.resultHeight.value = obj.height;
    },
    lockTheRatio: function() {
        var _this = view.DOM;

        if (controller.getLockStatus() === false) {
            controller.lockTheRatio(true);
            _this.itemWidth.disabled = true;
            _this.itemHeight.disabled = true;
            _this.resultWidth.disabled = false;
            _this.resultWidth.focus();
            _this.resultHeight.disabled = false;
            _this.lockBtn.classList.add('locked');
            _this.lockBtn.innerText = 'Unlock ratio';
            _this.calculateBtn.disabled = true;
            _this.recalculateBtn.disabled = false;
        } else {
            controller.lockTheRatio(false);
            _this.itemWidth.disabled = false;
            _this.itemHeight.disabled = false;
            _this.resultWidth.disabled = true;
            _this.resultHeight.disabled = true;
            _this.lockBtn.classList.remove('locked');
            _this.lockBtn.innerText = 'Lock ratio';
            _this.calculateBtn.disabled = false;
            _this.recalculateBtn.disabled = true;
        }
    },
    renderError: function(str) {
        var error = document.createElement('div');
        var errorText = document.createElement('span');

        error.id = 'error';
        errorText.innerText = str;

        error.appendChild(errorText);
        this.DOM.app.insertBefore(error, this.DOM.app.firstChild);

        var myInterval = setInterval(function() {
            error.remove();
            clearInterval(myInterval);
        }, 3000);
    },
    init: function() {
        this.DOM.app = document.getElementById('app');
        this.DOM.visual = document.getElementById('visual');
        this.DOM.result = document.getElementById('result');
        this.DOM.lockBtn = document.getElementById('lock');
        this.DOM.calculateBtn = document.getElementById('calculate');
        this.DOM.recalculateBtn = document.getElementById('recalculate');
        this.DOM.resultWidth = document.getElementById('resultWidth');
        this.DOM.resultHeight = document.getElementById('resultHeight');
        this.DOM.itemWidth = document.getElementById('width');
        this.DOM.itemHeight = document.getElementById('height');

        view.render();
    }
};

controller.init();