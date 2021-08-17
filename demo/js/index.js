class Slide {
    joinParams = {};
    el;
    parent;
    elWidth = 0;
    childWidth = 0;
    elementInitLeft = 0;
    pointerStart = 0;
    pointerEnd = 0;
    eventPointerMove;
    translateX = 0;
    /**
     * Calcul la taille d'un élement ajustée à celle de son parent
     * @param ratio {number}
     * @param itemWidth {number}
     * @param parentWidth {number}
     * @param gap {number}
     * @param nbChild
     * @return {number}
     */
    calculItemWidth(ratio, itemWidth, parentWidth, gap, nbChild) {
        const rest = parentWidth - (ratio * itemWidth + (gap * (ratio - 1)));
        return itemWidth + rest / ratio;
    }
    /**
     * Retourne le grid template column à appliquer à l'élement
     * @param nbr
     * @param value
     * @return {string}
     */
    getGridTemplateValue(nbr, value) {
        const data = typeof value === 'string' ? value : `${Math.round(value * 1000) / 1000}px`;
        return `repeat(${nbr}, ${data})`;
    }
    /**
     * Ajuste la taille des enfant d'un élement
     * @param el
     * @param childCount
     * @param ratio
     * @param firstChildWidth
     * @param parentWidth
     * @param gap
     * @param child
     */
    adjustChildren(el, childCount, ratio, firstChildWidth, parentWidth, gap, child) {
        this.childWidth = this.calculItemWidth(ratio, firstChildWidth, parentWidth, gap, childCount);
        el.style.display = "grid";
        el.style.gridTemplateColumns = this.getGridTemplateValue(childCount, this.childWidth);
        el.style.gap = `${gap}px`;
        child.forEach((e) => {
            e.style.width = '100%';
        });
        this.elWidth = (this.childWidth + gap - 1) * childCount;
    }
    onPointerMove(e) {
        const move = this.translateX - (this.pointerStart - e.pageX);
        const restVisible = this.elWidth + move;
        if (move < 0 && restVisible > this.parent.getBoundingClientRect().width) {
            this.el.style.transform = `translateX(${move}px)`;
            this.pointerEnd = move;
        }
    }
    onPointerUp(e) {
        this.el.removeEventListener('pointermove', this.eventPointerMove);
        this.el.style.transition = `${this.joinParams.duration}s`;
        this.el.style.transform = `translateX(${this.replacer(this.pointerEnd)}px)`;
    }
    replacer(move) {
        const ratio = Math.round(move / this.childWidth);
        console.log(this.childWidth * ratio + (ratio * (this.joinParams.gap - 1)));
        return Math.floor(this.childWidth * ratio + (ratio * (this.joinParams.gap - 1))) - 1;
    }
    onPointerDown(e) {
        e.preventDefault();
        this.el.style.transition = 'none';
        const style = window.getComputedStyle(this.el);
        const matrix = new WebKitCSSMatrix(style.transform);
        this.translateX = matrix.m41;
        this.pointerStart = e.pageX;
        this.eventPointerMove = this.onPointerMove.bind(this);
        this.el.addEventListener('pointermove', this.eventPointerMove);
        document.addEventListener('pointerup', this.onPointerUp.bind(this), { once: true });
    }
    /**
     * Add a slide comportment to children of element
     * @param el {HTMLElement} element dom when you want to make children slide
     * @param params {Object} the parameters to apply
     */
    constructor(el, params = {}) {
        this.joinParams = {
            ...{
                autoAdjust: false,
                gap: 0,
                duration: 0
            },
            ...params
        };
        this.el = el;
        this.parent = this.el.parentElement;
        this.el.style.transition = `${this.joinParams.duration}s`;
        // TODO if autoAdjust is true make adjust
        if (this.joinParams.autoAdjust) {
            const firstChild = this.el.firstElementChild;
            const child = Array.from(this.el.children);
            const childCount = child.length;
            const firstChildWidth = firstChild?.getBoundingClientRect().width || 0;
            const parentWidth = this.parent?.getBoundingClientRect().width || 0;
            const ratio = Math.trunc((parentWidth + this.joinParams.gap) / (firstChildWidth + this.joinParams.gap));
            this.adjustChildren(this.el, childCount, ratio, firstChildWidth, parentWidth, this.joinParams.gap, child);
        }
        // TODO Add scroll behavior
        this.el.style.position = 'relative';
        this.elementInitLeft = this.el.getBoundingClientRect().left;
        this.el.addEventListener('pointerdown', this.onPointerDown.bind(this));
        // TODO Add finger scroll behavior
        // TODO Apply params
        // TODO manage responsive
    }
}
export default Slide;
