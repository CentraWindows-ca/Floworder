"use client";
import React, { useState } from "react";
import _ from "lodash";

function DragAndDrop({ items, render, onChange, className, ...rest }) {
  const [temporaryItems, setTemporaryItems] = useState();
  const [draggedItem, setDragedItem] = useState();
  const [dragable, setDragable] = useState(false)

  const renderedItems = temporaryItems || items;

  const handleDragEnd = () => {
    setDragedItem(undefined);
    setTemporaryItems(undefined);
    onChange(renderedItems);
    setDragable(false)
  };

  return (
    <>
      {renderedItems.map((item, index) => {

        const handleDragOver = (e) => {
          e.preventDefault();
          if (!draggedItem || draggedItem === item) {
            return;
          }
          const currentIndex = renderedItems.indexOf(draggedItem);
          const targetIndex = renderedItems.indexOf(item);

          if (currentIndex !== -1 && targetIndex !== -1) {
            const newItems = [...renderedItems];
            newItems.splice(currentIndex, 1);
            newItems.splice(targetIndex, 0, draggedItem);
            setTemporaryItems(newItems);
          }
        };

        return (
          <div key={index} className={className} style={{ ...(item === draggedItem ? { opacity: "0.4", border: "2px dashed grey" } : {border: "2px dashed transparent"}) }} 
          draggable={dragable} 
          onDragStart={() => setDragedItem(item)}         
          onDragOver={handleDragOver} 
          onDragEnd={handleDragEnd}
          {...rest}
          >
            {render(item, index, {
              dragHandleProps: {},
              onDrag: (isDragging) => {
                setDragable(isDragging)
              }
            })}
          </div>
        );
      })}
    </>
  );
}

export default React.memo(DragAndDrop);