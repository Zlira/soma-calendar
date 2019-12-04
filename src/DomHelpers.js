export default function hideOnClickOutside(element, hide) {
  const outsideClickListener = event => {
    if (!element.contains(event.target)) {
      hide()
    }
  }

  document.addEventListener('click', outsideClickListener)
  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  return removeClickListener
}
