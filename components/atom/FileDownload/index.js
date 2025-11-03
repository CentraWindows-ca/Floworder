import React, { useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import utils from "lib/utils";
import HoverPopover from "components/atom/HoverPopover";
import styles from "./styles.module.scss"

const Com = ({ ...props }) => {
  const {
    href,
    submittedBy,
    submittedAt,
    fileName,
    fileType,
    fileSize,
    notes,
    id,
  } = props;
  const size = utils.formatNumber(fileSize / 1024 || 0);

  return (
    <HoverPopover
      trigger={
        <>
          <a
            className="text-blue-500 hover:text-blue-400 text-left"
            href={href}
            target="_blank"
          >
            {getFileIcon(fileType, 'me-2')}
            <b>{fileName}</b> [{size} KB]
          </a>
        </>
      }
      placement={"left-start"}
      className = "text-left"
    >
      <PopoverDiv
        {...{
          fileName,
          submittedBy,
          submittedAt,
          notes,
        }}
      />
    </HoverPopover>
  );
};

const getFileIcon = (fileType, className) => {
  if (fileType?.includes("pdf")) {
    return <i className={cn("fa-regular fa-file-pdf pt-1 text-red-600", className)} />;
  }
  if (fileType?.includes("word")) {
    return <i className={cn("fa-regular fa-file-word pt-1 text-blue-600", className)} />;
  }
  if (fileType?.includes("image")) {
    return <i className={cn("fa-regular fa-file-image pt-1 text-teal-600", className)} />;
  }
  if (fileType?.includes("text")) {
    return <i className={cn("fa-regular fa-file-lines pt-1 text-gray-600", className)} />;
  }
  return <i className={cn("fa-regular fa-file pt-1 text-gray-400", className)} />;
};

const PopoverDiv = ({ notes, fileName, submittedBy, submittedAt }) => {
  return (
    <div>
      <div>
        <b>{submittedBy}</b> [{submittedAt}]
      </div>
      <div className={cn(styles.fileNotes)} style={{ whiteSpace: "pre-wrap" }}>
        {notes}
      </div>
    </div>
  );
};

export default Com;
