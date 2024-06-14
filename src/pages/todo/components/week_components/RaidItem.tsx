import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { forwardRef } from "react";

import { TodoType } from "@core/types/Character.type";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  todo: TodoType;
}

const RaidItem = forwardRef<HTMLDivElement, Props>(
  ({ withOpacity = false, isDragging = false, style, todo, ...props }, ref) => {
    const inlineStyles: React.CSSProperties = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      borderRadius: "5px",
      cursor: isDragging ? "grabbing" : "grab",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      ...style,
    };

    return (
      <div className="content-wrap" ref={ref} style={inlineStyles} {...props}>
        <div
          className="content"
          style={{
            height: 75,
            position: "relative",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <button
              className={`content-button ${todo.check ? "done" : ""}`}
              type="button"
            >
              {todo.check ? <DoneIcon /> : <CloseIcon />}
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                className={`${todo.check ? "text-done" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: todo.name.replace(/\n/g, "<br />"),
                }}
              />
              <div className={`${todo.check ? "text-done" : ""}`} />
              <div className="input-field" id={`input_field_${todo.id}`}>
                {todo.message !== null && (
                  <input
                    type="text"
                    spellCheck="false"
                    defaultValue={todo.message}
                    style={{ width: "90%" }}
                    placeholder="메모 추가"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="content gauge-box"
          style={{ height: 16, padding: 0, position: "relative" }}
        >
          {Array.from({ length: todo.totalGate }, (_, index) => (
            <div
              key={`${todo.id}-${index}`}
              className="gauge-wrap"
              style={{
                backgroundColor: todo.currentGate > index ? "#ffbfb6" : "", // pub
                width: `${100 / todo.totalGate}%`,
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-color)",
              }}
            >
              <span>{index + 1}관문</span>
            </div>
          ))}
          <span className="gauge-text" />
        </div>
      </div>
    );
  }
);

export default RaidItem;
