let mousePos = {
    x: 0,
    y: 0
}

let cursor = {
    text: '',
    width: {
        target: 20,
        current: 20
    },
    height: {
        target: 20,
        current: 20
    },
    textOpacity: {
        target: 0,
        current: 0
    },
    default: {
        r: 20
    }
}

function animate() {
    requestAnimationFrame(animate);
    drawCursor(mousePos)
};

function drawCursor(mouse) {
    cursor.width.current += (cursor.width.target - cursor.width.current) * .2;
    cursor.height.current += (cursor.height.target - cursor.height.current) * .2;
    cursor.textOpacity.current += (cursor.textOpacity.target - cursor.textOpacity.current) * .15;

    cursorCtx.clearRect(0, 0, cursorCtx.canvas.width, cursorCtx.canvas.height)

    let x = mouse.x - cursor.width.current / 2;
    let y = mouse.y - cursor.height.current / 2;
    cursorCtx.fillStyle = '#f36cff';
    cursorCtx.roundRect(x, y, cursor.width.current, cursor.height.current, 12)
    cursorCtx.fill()

    cursorCtx.fillStyle = `rgba(0,0,0,${cursor.textOpacity.current})`;
    cursorCtx.fillText(cursor.text, x + 5, y + 5 + cursor.height.current / 2)
}

function initCursor() {
    cursorCanvas = document.querySelector('#cursor')
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;

    cursorCtx = cursorCanvas.getContext('2d')
    cursorCtx.font = '500 18px haas, Helvetica, sans-serif'
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    }

    let acitveElements = document.querySelectorAll('[data-cursorText]');
    acitveElements.forEach(el => {
        el.addEventListener('mouseover', function () {
            cursor.height.target = 20;
            cursor.text = el.getAttribute('data-cursorText')
            cursor.width.target = cursorCtx.measureText(cursor.text).width + 10;
            window.setTimeout(function () {
                cursor.textOpacity.target = 1;
            }, 70)

        })
        el.addEventListener('mouseout', function () {
            cursor.width.target = cursor.default.r;
            cursor.height.target = cursor.default.r;
            cursor.textOpacity.target = 0;
            cursor.text = ''
        })
    })
}

window.addEventListener('DOMContentLoaded', () => {
    initCursor()
    animate()

    window.addEventListener('resize', e => {
        initCursor()
    })

    window.addEventListener('mousemove', e => {
        mousePos = {
            x: e.clientX,
            y: e.clientY,
        }
    })
})