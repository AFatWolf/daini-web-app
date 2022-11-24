import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

export const useModal = (modal, isId = true) => {
    const modalEl = isId ? document.querySelector(`#${modal}`) : modal
    return bootstrap.Modal.getOrCreateInstance(modalEl)
  }