/**
 * Calcul la taille d'un élement ajustée à celle de son parent
 * @param ratio {number}
 * @param itemWidth {number}
 * @param parentWidth {number}
 * @param gap {number}
 * @param nbChild
 * @return {number}
 */
function calculItemWidth(ratio: number, itemWidth: number, parentWidth: number, gap: number, nbChild: number): number {
  const rest = parentWidth - (ratio * itemWidth + (gap * (ratio - 1)))

  return itemWidth + rest / ratio
}

/**
 * Retourne le grid template column à appliquer à l'élement
 * @param nbr
 * @param value
 * @return {string}
 */
function getGridTemplateValue(nbr: number, value: number | string): string {
  const data = typeof value === 'string' ? value : `${value}px`
  return `repeat(${nbr}, ${data})`
}

/**
 * Add a slide comportment to children of element
 * @param el {HTMLElement} element dom when you want to make children slide
 * @param params {Object} the parameters to apply
 */
function Slide(el: HTMLElement, params: any = {}) {
  const joinParams = {
    ...{
      autoAdjust: false,
      gap: 0
    },
    ...params
  }
  // TODO if autoAdjust is true make adjust
  if (joinParams.autoAdjust) {
    const firstChild = el.firstElementChild
    const parent = el.parentElement
    const child = Array.from(el.children)
    const childCount = child.length

    const firstChildWidth = firstChild?.getBoundingClientRect().width || 0
    const parentWidth = parent?.getBoundingClientRect().width || 0

    const ratio = Math.trunc((parentWidth + joinParams.gap) / (firstChildWidth + joinParams.gap))

    console.log(parentWidth, firstChildWidth, ratio)

    el.style.display = "grid"
    el.style.gridTemplateColumns = getGridTemplateValue(childCount, calculItemWidth(ratio, firstChildWidth, parentWidth, joinParams.gap, childCount))
    el.style.gap = `${joinParams.gap}px`

    child.forEach((e: Element) => {
      (e as HTMLElement).style.width = '100%'
    })
  }
  // TODO Add scroll behavior
  // TODO Add finger scroll behavior
  // TODO Apply params
  // TODO manage responsive
}

export default Slide

console.log('Hello word')
