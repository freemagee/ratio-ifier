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

        exportObj = {ratio: this.ratio, shape: shape, w: w, h: h};

        controller.setRatio(exportObj);
    },
    getRatio: function() {
        return this.ratio;
    },
    recalculateRatio: function(event, newW, newH) {
        var value = null;
        var source = event.target.id;

        if (source === 'resultWidth') {
            if (newW > newH) {
                value = (newW / this.ratio);
            } else {
                value = (newW * this.ratio);
            }

            return {dimension: 'height', value: value};
        } else {
            if (newH > newW) {
                value = (newH / this.ratio);
            } else {
                value = (newH * this.ratio);
            }

            return {dimension: 'width', value: value};
        }
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
        if (w === '' || h === '') {
            view.renderError('Please enter values into Width and Height');
            return false;
        } else {
            w = parseInt(w);
            h = parseInt(h);
        }
        if (isNaN(w) || isNaN(h)) {
            view.renderError('Please enter numbers into Width and Height');
            return false;
        } else {
            return model.calculateRatio(w, h);
        }
    },
    lockTheRatio: function(b) {
        model.lockRatio(b);
    },
    getLockStatus: function() {
        return model.lockStatus();
    },
    recalculateRatio: function(e, w, h) {
        var obj = model.recalculateRatio(e, w, h);

        if (e.keyCode !== 13) {
            return false;
        } else {
            view.renderRecalculatedRatio(obj);
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
        this.DOM.resultWidth.addEventListener('keydown', function(e) {
            controller.recalculateRatio(e, _this.resultWidth.value, _this.resultHeight.value);
        });
        this.DOM.resultHeight.addEventListener('keydown', function(e) {
            controller.recalculateRatio(e, _this.resultWidth.value, _this.resultHeight.value);
        });
    },
    renderRatio: function(obj) {
        this.DOM.resultWidth.value = obj.w;
        this.DOM.resultHeight.value = obj.h;
        this.DOM.lockBtn.disabled = false;

        view.renderResult(obj);
    },
    renderResult: function(obj) {
        this.DOM.result.innerHTML = obj.ratio.toFixed(2);
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
        if (obj.dimension === 'width') {
            this.DOM.resultWidth.value = obj.value.toFixed(2);
        } else {
            this.DOM.resultHeight.value = obj.value.toFixed(2);
        }
    },
    lockTheRatio: function() {
        var _this = view.DOM;

        if (controller.getLockStatus() === false) {
            controller.lockTheRatio = true;
            _this.itemWidth.disabled = true;
            _this.itemHeight.disabled = true;
            _this.resultWidth.disabled = false;
            _this.resultWidth.focus();
            _this.resultHeight.disabled = false;
            _this.lockBtn.classList.add('locked');
            _this.lockBtn.innerText = 'Unlock ratio';
            _this.calculateBtn.disabled = true;
        } else {
            controller.lockTheRatio = false;
            _this.itemWidth.disabled = false;
            _this.itemHeight.disabled = false;
            _this.resultWidth.disabled = true;
            _this.resultHeight.disabled = true;
            _this.lockBtn.classList.remove('locked');
            _this.lockBtn.innerText = 'Lock ratio';
            _this.calculateBtn.disabled = false;
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
        this.DOM.resultWidth = document.getElementById('resultWidth');
        this.DOM.resultHeight = document.getElementById('resultHeight');
        this.DOM.itemWidth = document.getElementById('width');
        this.DOM.itemHeight = document.getElementById('height');

        view.render();
    }
};

controller.init();