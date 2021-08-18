class Slide {
  joinParams: any = {}
  el: HTMLElement
  parent: HTMLElement
  child: Element[]
  elWidth = 0
  childWidth = 0
  elementInitLeft = 0
  pointerStart: number = 0
  pointerEnd: number = 0
  eventPointerMove: any
  pointerDown: any
  translateX = 0
  firstChild: Element
  childCount = 0
  firstChildWidth = 0



  /**
   * Add a slide comportment to children of element
   * @param el {HTMLElement} element dom when you want to make children slide
   * @param params {Object} the parameters to apply
   */
  constructor(el: HTMLElement, params: any = {}) {
    this.joinParams = {
      ...{
        autoAdjust: false,
        gap: 0,
        duration: .3
      },
      ...params
    }
    this.el = el
    this.parent = this.el.parentElement as HTMLElement
    this.el.style.transition = `${this.joinParams.duration}s`
    this.child = Array.from(this.el.children)
    this.firstChild = this.el.firstElementChild as Element
    this.childCount = this.child.length
    this.firstChildWidth = this.firstChild?.getBoundingClientRect().width || 0

    this.pointerDown = this.onPointerDown.bind(this)
    this.eventPointerMove = this.onPointerMove.bind(this)

    // TODO if autoAdjust is true make adjust
    this.autoAdjust()
    // TODO Add scroll behavior
    this.el.style.position = 'relative'
    this.elementInitLeft = this.el.getBoundingClientRect().left


    this.el.addEventListener('pointerdown', this.pointerDown)
    // TODO Add finger scroll behavior
    this.el.addEventListener('touchstart', this.onTouchStart.bind(this))

    // TODO Apply params
    // TODO manage responsive
    window.addEventListener('resize', this.autoAdjust.bind(this))
  }

  onPointerMove(e: MouseEvent) {
    const move = this.translateX - (this.pointerStart - e.pageX)
    const restVisible = this.elWidth + move

    if (move < 0 && restVisible > this.parent.getBoundingClientRect().width) {
      this.el.style.transform = `translateX(${move}px)`
      this.pointerEnd = move
    }
  }

  onPointerUp() {
    this.el.removeEventListener('pointermove', this.eventPointerMove)
    this.el.style.transition = `${this.joinParams.duration}s`
    this.el.style.transform = `translateX(-${this.replacer(this.pointerEnd)}px)`
  }

  onPointerDown(e: MouseEvent) {
    e.preventDefault()
    this.el.style.transition = 'none'
    const style = window.getComputedStyle(this.el);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.translateX = matrix.m41
    this.pointerStart = e.pageX
    this.el.addEventListener('pointermove', this.eventPointerMove)

    document.addEventListener('pointerup', this.onPointerUp.bind(this))
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault()
    this.el.style.transition = 'none'
    const style = window.getComputedStyle(this.el);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.translateX = matrix.m41
    this.pointerStart = e.changedTouches[0].pageX
  }

  autoAdjust() {
    if (this.joinParams.autoAdjust) {
      const parentWidth = this.parent?.getBoundingClientRect().width || 0
      const ratio = Math.trunc((parentWidth + this.joinParams.gap) / (this.firstChildWidth + this.joinParams.gap))
      this.adjustChildren(this.el, this.childCount, ratio, this.firstChildWidth, parentWidth, this.joinParams.gap, this.child)
    }
  }

  /**
   * Calcul la taille d'un élement ajustée à celle de son parent
   * @param ratio {number}
   * @param itemWidth {number}
   * @param parentWidth {number}
   * @param gap {number}
   * @param nbChild
   * @return {number}
   */
  calculItemWidth(ratio: number, itemWidth: number, parentWidth: number, gap: number, nbChild: number): number {
    const rest = parentWidth - (ratio * itemWidth + (gap * (ratio - 1)))

    return itemWidth + rest / ratio
  }

  /**
   * Retourne le grid template column à appliquer à l'élement
   * @param nbr
   * @param value
   * @return {string}
   */
  getGridTemplateValue(nbr: number, value: number | string): string {
    const data = typeof value === 'string' ? value : `${Math.round(value * 1000) / 1000}px`
    return `repeat(${nbr}, ${data})`
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
  adjustChildren(el: HTMLElement, childCount: number, ratio: number, firstChildWidth: number, parentWidth: number, gap: number, child: Element[] ) {
    this.childWidth = this.calculItemWidth(ratio, firstChildWidth, parentWidth, gap, childCount)
    el.style.display = "grid"
    el.style.gridTemplateColumns = this.getGridTemplateValue(childCount, this.childWidth)
    el.style.gap = `${gap}px`

    child.forEach((e: Element) => {
      (e as HTMLElement).style.width = '100%'
    })
    this.elWidth = (this.childWidth + gap - 1) * childCount
  }

  replacer(move: number): number {
    const ratio = Math.round(move / this.childWidth)
    const returnTo = this.child[-1 * ratio]
    return (returnTo?.getBoundingClientRect().left || 0) - this.el.getBoundingClientRect().left
  }

}

export default Slide
