class Slide {
    joinParams = {};
    el;
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
        const data = typeof value === 'string' ? value : `${value}px`;
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
        el.style.display = "grid";
        el.style.gridTemplateColumns = this.getGridTemplateValue(childCount, this.calculItemWidth(ratio, firstChildWidth, parentWidth, gap, childCount));
        el.style.gap = `${gap}px`;
        child.forEach((e) => {
            e.style.width = '100%';
        });
    }
    onPointerMove(e) {
        console.log(e);
        this.el.style.transform = `translateX(${this.translateX - (this.pointerStart - e.pageX)}px)`;
    }
    onPointerUp(e) {
        this.el.removeEventListener('pointermove', this.eventPointerMove);
        this.pointerEnd = e.pageX;
    }
    onPointerDown(e) {
        e.preventDefault();
        const style = window.getComputedStyle(this.el);
        const matrix = new WebKitCSSMatrix(style.transform);
        this.translateX = matrix.m41;
        this.pointerStart = e.pageX;
        this.eventPointerMove = this.onPointerMove.bind(this);
        this.el.addEventListener('pointermove', this.eventPointerMove);
        this.el.addEventListener('pointerup', this.onPointerUp.bind(this), { once: true });
        this.el.addEventListener('pointerout', this.onPointerUp.bind(this), { once: true });
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
                gap: 0
            },
            ...params
        };
        this.el = el;
        // TODO if autoAdjust is true make adjust
        if (this.joinParams.autoAdjust) {
            const firstChild = this.el.firstElementChild;
            const parent = this.el.parentElement;
            const child = Array.from(this.el.children);
            const childCount = child.length;
            const firstChildWidth = firstChild?.getBoundingClientRect().width || 0;
            const parentWidth = parent?.getBoundingClientRect().width || 0;
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
