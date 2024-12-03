import React from "react";
import Icon from "@/components/Icon";

interface PopupProps {
  title: string;
  message: string;
  icon: string;
  buttonText?: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({
  title,
  message,
  icon,
  visible,
  buttonText = "Ok",
  onConfirm,
  onCancel,
}) => {
  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      id="static-modal"
      className={`fixed z-50 inset-0 overflow-y-auto ${!visible ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      onClick={onCancel}
      style={{
        transition: 'visibility 0.3s ease-in-out',
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          onClick={handleModalClick}
          className="inline-block align-bottom bg-background-1 rounded-3xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="hidden sm:block absolute top-0 right-0 pt-5 pr-5">
            <Icon
              icon="close"
              className="hover:cursor-pointer"
              onClick={onCancel}
            />
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-foreground-1 sm:mx-0 sm:h-10 sm:w-10">
              <Icon
                icon={icon}
                className="text-primary-1"
                style={{ fontSize: "24px" }}
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-foreground-4">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse mt-5 gap-2 md:gap-0">
            <button
              type="button"
              data-behavior="commit"
              onClick={onConfirm}
              className="w-full justify-center rounded-xl px-4 py-2 bg-primary-1 font-medium sm:ml-3 sm:w-auto sm:text-sm"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
