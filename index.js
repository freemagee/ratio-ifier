var ratioLocked = false,
    ratio = null,
    app = document.getElementById('app'),
    itemWidth = document.getElementById('width'),
    itemHeight = document.getElementById('height'),
    calculateBtn = document.getElementById('calculate'),
    lockBtn = document.getElementById('lock'),
    output = document.getElementById('output'),
    result = document.getElementById('result'),
    resultWidth = document.getElementById('resultWidth'),
    resultHeight = document.getElementById('resultHeight'),
    visual = document.getElementById('visual'),
    calculateRatio = function calculateRatioFn() {
        let w = itemWidth.value,
            h = itemHeight.value;

        if (w > h) {
            ratio = (w / h);
            result.innerHTML = ratio.toFixed(2);
            drawResult('landscape');
        } else if (h > w) {
            ratio = (h / w);
            result.innerHTML = ratio.toFixed(2);
            drawResult('portrait');
        } else {
            ratio = 1;
            result.innerHTML = ratio.toFixed(2);
            drawResult('square');
        }

        resultWidth.value = w;
        resultHeight.value = h;
        lockBtn.disabled = false;
    },
    reCalculate = function reCalculateFn() {
        let origW = itemWidth.value,
            origH = itemHeight.value,
            newW = resultWidth.value,
            newH = resultHeight.value,
            source = event.target.id;

        if (event.keyCode !== 13) {
            return false;
        }

        if (source === 'resultWidth') {
            if (newW > newH) {
                resultHeight.value = (newW / ratio).toFixed(2);
            } else {
                resultHeight.value = (newW * ratio).toFixed(2);
            }
        } else {
            if (newH > newW) {
                resultWidth.value = (newH / ratio).toFixed(2);
            } else {
                resultWidth.value = (newH * ratio).toFixed(2);
            }
        }
    },
    drawResult = function drawResultFn(type) {
        visual.className = '';
        if (type === 'landscape') {
            visual.classList.add('landscape');
        } else if (type === 'portrait') {
            visual.classList.add('portrait');
        } else {
            visual.classList.add('square');
        }
    },
    lockRatio = function lockRatioFn() {
        if (!ratioLocked) {
            ratioLocked = true;
            itemWidth.disabled = true;
            itemHeight.disabled = true;
            resultWidth.disabled = false;
            resultWidth.focus();
            resultHeight.disabled = false;
            lockBtn.classList.add('locked');
            lockBtn.innerText = 'Unlock ratio';
            calculateBtn.disabled = true;
        } else {
            ratioLocked = false;
            itemWidth.disabled = false;
            itemHeight.disabled = false;
            resultWidth.disabled = true;
            resultHeight.disabled = true;
            lockBtn.classList.remove('locked');
            lockBtn.innerText = 'Lock ratio';
            calculateBtn.disabled = false;
        }
    };

calculateBtn.addEventListener('click', calculateRatio);
resultWidth.addEventListener('keydown', reCalculate);
resultHeight.addEventListener('keydown', reCalculate);
lockBtn.addEventListener('click', lockRatio);