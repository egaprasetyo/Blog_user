import React from 'react'

type modalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  allowClickOutside: boolean;
}

const Modal = ({ visible, onClose, allowClickOutside, children }: modalProps) => {

  return (
    <div
      className={`fixed z-30 w-full h-100 inset-0 flex justify-center items-center transition-colors ${visible ? "visible bg-black/20" : "invisible"}`}
      {...(allowClickOutside ? { onClick: onClose } : {})}
    >
      <div
        className={`bg-white rounded-lg shadow px-10 pt-10 pb-6 transition-all w-10/12 md:w-1/2 ${visible ? "scale-100 opacity-100" : "scale-110 opacitiy-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 py-1 px-3 text-2xl border border-neutral-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal