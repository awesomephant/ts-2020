let mousePos = {
    x: 0,
    y: 0
}

let cursor = {
    text: '',
    el: null,
    textEl: null,
    width: {
        target: 20,
        default: 10,
    },
    height: {
        target: 20,
        default: 10
    },
    textOpacity: {
        current: 0
    }
}

function animate() {
    requestAnimationFrame(animate);
    drawCursor(mousePos)
};

function drawCursor(mouse) {
    let x = mouse.x;
    let y = mouse.y;
    cursor.el.style.transform = `translateX(calc(${x}px - 50%)) translateY(${y}px)`;
    cursor.el.style.width = `${cursor.width.target}px`;
    cursor.textEl.style.opacity = cursor.textOpacity.current;
}

function initCursor() {
    cursor.el = document.querySelector('.cursor-container')
    cursor.textEl = document.querySelector('.cursor-text')

    let acitveElements = document.querySelectorAll('[data-cursorText]');
    acitveElements.forEach(el => {
        el.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            cursor.text = el.getAttribute('data-cursorText')
            cursor.textEl.textContent = el.getAttribute('data-cursorText')
            cursor.width.target = cursor.textEl.scrollWidth;
            window.setTimeout(function () {
                cursor.textOpacity.current = 1;
            }, 70)
            
        })
        el.addEventListener('mouseout', function () {
            cursor.width.target = cursor.width.default;
            cursor.height.target = cursor.height.default;
            cursor.textOpacity.current = 0;
            cursor.textEl.textContent = ''
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