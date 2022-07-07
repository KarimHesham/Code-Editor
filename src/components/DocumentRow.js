import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveFile } from "../features/fileSlice";
import { useState } from "react";
import Icon from "@material-tailwind/react/Icon";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItemText } from "@mui/material";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function DocumentRow({ id, fileName, date, fileContent }) {
  // History state
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleFileClick() {
    dispatch(
      setActiveFile({
        id: id,
        title: fileName,
        content: fileContent,
      })
    );
    navigate(`/files/${id}`);
  }

  async function handleDeleteFile(id) {
    await deleteDoc(doc(db, "docs", id))
      .then(() => {
        console.log("File Deleted Successfully!");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="flex items-center rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-200">
      <div className="flex flex-grow ml-auto" onClick={() => handleFileClick()}>
        <Icon name="article" size="3xl" color="blue" />
        <p className=" pl-5 pr-10 truncate">{fileName}</p>
      </div>

      <div className="flex items-center">
        <p className="text-sm">{date?.toDate().toLocaleDateString()}</p>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="hover:bg-gray-400"
        >
          <Icon color="gray" name="more_vert" size="3xl" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleFileClick()}>
            <ListItemIcon>
              <Icon color="blue" name="edit" size="xl" />
            </ListItemIcon>
            <ListItemText>تعديل</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDeleteFile(id)}>
            <ListItemIcon>
              <Icon color="red" name="delete" size="xl" />
            </ListItemIcon>
            <ListItemText>مسح</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default DocumentRow;
