import Popup from "reactjs-popup";
import { type IPopupWindow } from "./../typings/PopupWindow";

export const PopupWindow: React.FC<IPopupWindow> = (props) => {
  return (
    <Popup
      arrow={false}
      trigger={
        <button>
          {props.icon && (
            <props.icon
              className={`mr-2 ${
                props.selectedNoteId ? "" : "cursor-not-allowed opacity-50"
              }`}
              title={props.title}
            />
          )}
          {props.iconDisplay && (
            <props.iconDisplay className="mr-2" title={props.title} />
          )}
        </button>
      }
    >
      <div className={`sm:mt-44 xl:absolute xl:mt-4 ${props.marginLeft}`}>
        {props.content}
      </div>
    </Popup>
  );
};
